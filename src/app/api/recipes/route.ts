import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/db";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import type { RecipeSavePayload } from "@/types/recipe";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(
  value: unknown,
  { required = false, maxLength = 50000 } = {},
): string | undefined {
  if (typeof value !== "string") {
    return required ? undefined : "";
  }

  const normalized = value.trim();
  if ((required && !normalized) || normalized.length > maxLength) {
    return undefined;
  }

  return normalized;
}

function parseRecipe(value: unknown): RecipeSavePayload | null {
  if (!isRecord(value)) return null;

  const sourceMealId = getString(value.sourceMealId, {
    required: true,
    maxLength: 32,
  });
  const title = getString(value.title, { required: true, maxLength: 200 });
  const instructions = getString(value.instructions, {
    required: true,
    maxLength: 50000,
  });
  const description = getString(value.description, { maxLength: 2000 });
  const image = getString(value.image, { maxLength: 2048 });
  const category = getString(value.category, { maxLength: 100 });
  const area = getString(value.area, { maxLength: 100 });

  if (
    !sourceMealId ||
    !/^\d+$/.test(sourceMealId) ||
    !title ||
    !instructions ||
    description === undefined ||
    image === undefined ||
    category === undefined ||
    area === undefined ||
    !Array.isArray(value.ingredients) ||
    value.ingredients.length > 50 ||
    typeof value.isAiModified !== "boolean"
  ) {
    return null;
  }

  const ingredients = [];
  for (const ingredient of value.ingredients) {
    if (!isRecord(ingredient)) return null;
    const name = getString(ingredient.name, { required: true, maxLength: 150 });
    const measure = getString(ingredient.measure, { maxLength: 100 });
    if (!name || measure === undefined) return null;
    ingredients.push({ name, measure });
  }

  let normalizedImage = image;
  if (image) {
    try {
      const imageUrl = new URL(image);
      if (imageUrl.protocol !== "https:") return null;
      normalizedImage = imageUrl.toString();
    } catch {
      return null;
    }
  }

  return {
    sourceMealId,
    title,
    description,
    ingredients,
    instructions,
    image: normalizedImage,
    category,
    area,
    isAiModified: value.isAiModified,
  };
}

async function getOwnerId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.user.id) {
    return {
      ownerId: null,
      response: NextResponse.json(
        { message: "Sign in to save and view your recipes." },
        { status: 401 },
      ),
    };
  }

  await dbConnect();
  const userById = Types.ObjectId.isValid(session.user.id)
    ? await User.findById(session.user.id).select("_id")
    : null;
  const user = userById ?? (await User.findOne({ email: session.user.email }).select("_id"));

  if (!user) {
    return {
      ownerId: null,
      response: NextResponse.json(
        { message: "Your account could not be found." },
        { status: 404 },
      ),
    };
  }

  return { ownerId: user._id, response: null };
}

export async function GET(request: NextRequest) {
  try {
    const sourceMealId = request.nextUrl.searchParams.get("sourceMealId");
    if (sourceMealId !== null && !/^\d{1,32}$/.test(sourceMealId)) {
      return NextResponse.json(
        { message: "A valid recipe ID is required." },
        { status: 400 },
      );
    }

    const { ownerId, response } = await getOwnerId();
    if (response) return response;

    if (sourceMealId === null) {
      const recipes = await Recipe.find({ user: ownerId })
        .select(
          "_id sourceMealId title description ingredients instructions image category area isAiModified createdAt updatedAt",
        )
        .sort({ updatedAt: -1 })
        .lean();

      return NextResponse.json({
        recipes: recipes.map((recipe) => ({
          ...recipe,
          _id: String(recipe._id),
        })),
      });
    }

    const recipe = await Recipe.findOne({ user: ownerId, sourceMealId })
      .select("_id isAiModified")
      .lean();

    return NextResponse.json({
      isSaved: Boolean(recipe),
      isAiModified: recipe?.isAiModified ?? false,
    });
  } catch (error) {
    console.error("Saved recipe lookup failed:", error);
    return NextResponse.json(
      { message: "Unable to check your saved recipe right now." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sourceMealId = request.nextUrl.searchParams.get("sourceMealId");
    if (!sourceMealId || !/^\d{1,32}$/.test(sourceMealId)) {
      return NextResponse.json(
        { message: "A valid recipe ID is required." },
        { status: 400 },
      );
    }

    const { ownerId, response } = await getOwnerId();
    if (response) return response;

    const deletedRecipe = await Recipe.findOneAndDelete({
      user: ownerId,
      sourceMealId,
    }).select("_id");

    if (!deletedRecipe) {
      return NextResponse.json(
        { message: "Saved recipe not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Saved recipe deletion failed:", error);
    return NextResponse.json(
      { message: "Unable to delete this recipe right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = parseRecipe(await request.json());
    if (!payload) {
      return NextResponse.json(
        { message: "The recipe details are invalid." },
        { status: 400 },
      );
    }

    const { ownerId, response } = await getOwnerId();
    if (response) return response;

    const { sourceMealId, ...recipe } = payload;
    const filter = { user: ownerId, sourceMealId };
    const update = { $set: recipe };
    let result;

    try {
      result = await Recipe.updateOne(filter, update, {
        upsert: true,
        runValidators: true,
      });
    } catch (error) {
      if (!isRecord(error) || error.code !== 11000) throw error;
      result = await Recipe.updateOne(filter, update, { runValidators: true });
    }

    return NextResponse.json({
      isSaved: true,
      created: result.upsertedCount === 1,
      isAiModified: payload.isAiModified,
    });
  } catch (error) {
    console.error("Recipe save failed:", error);
    return NextResponse.json(
      { message: "Unable to save this recipe right now." },
      { status: 500 },
    );
  }
}
