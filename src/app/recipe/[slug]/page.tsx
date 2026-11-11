import Image from "next/image";
import Link from "next/link";
import MarkdownViewer from "@/components/markdown";
import Ai from "@/components/ai-assistance";
import RecipeSaveButton from "@/components/recipe-save-button";
import type { RecipeSavePayload } from "@/types/recipe";

interface IngredientType {
  idIngredient: string;
  strDescription: string | null;
  strIngredient: string;
}

interface MealPreview {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

type MealDetail = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
} & Record<`strIngredient${number}` | `strMeasure${number}`, string | null>;

async function getIngredientDetails(id: string) {
  const ingredientsResponse = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
  );
  if (!ingredientsResponse.ok) {
    throw new Error("Failed to fetch ingredients");
  }

  const ingredientData: { meals: IngredientType[] | null } =
    await ingredientsResponse.json();
  const ingredient = ingredientData.meals?.find(
    (item) => item.idIngredient === id,
  );

  if (!ingredient) {
    return null;
  }

  const mealsResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient.strIngredient)}`,
  );
  if (!mealsResponse.ok) {
    throw new Error(`Failed to fetch meals for ${ingredient.strIngredient}`);
  }

  const mealsData: { meals: MealPreview[] | null } = await mealsResponse.json();

  return { ingredient, meals: mealsData.meals?.slice(0, 6) ?? [] };
}

function getIngredients(meal: MealDetail) {
  const ingredients: { ingredient: string; measure: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  return ingredients;
}

export default async function RecipeGuide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const ingredientMatch = /^ingredient-(\d+)$/.exec(slug);
  if (ingredientMatch) {
    const details = await getIngredientDetails(ingredientMatch[1]);

    if (!details) {
      return <div className="p-6">Ingredient not found.</div>;
    }

    const { ingredient, meals } = details;

    return (
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <Link
          href="/recipe"
          className="text-sm text-green-600 hover:underline"
        >
          &larr; Featured ingredients
        </Link>

        <section className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-1/2 h-64 md:h-80">
            <Image
              src={`https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`}
              alt={ingredient.strIngredient}
              fill
              className="object-contain rounded-xl"
            />
          </div>
          <div className="flex-1 space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold">
              {ingredient.strIngredient}
            </h1>
            {ingredient.strDescription && (
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                {ingredient.strDescription}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-lime-500">
            Meals with {ingredient.strIngredient}
          </h2>
          {meals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {meals.map((meal) => (
                <Link
                  key={meal.idMeal}
                  href={`/recipe/${meal.idMeal}`}
                  className="group rounded-xl overflow-hidden border hover:shadow-md transition"
                >
                  <div className="relative w-full h-28">
                    <Image
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-semibold line-clamp-2">
                      {meal.strMeal}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      View recipe &rarr;
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No meals found for this ingredient.
            </p>
          )}
        </section>
      </main>
    );
  }

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${slug}`,
    { cache: "no-store" },
  );

  const data: { meals: MealDetail[] | null } = await response.json();
  const meal = data.meals?.[0];

  if (!meal) {
    return <div className="p-6">Recipe not found.</div>;
  }

  const ingredients = getIngredients(meal);
  const recipeToSave: RecipeSavePayload = {
    sourceMealId: meal.idMeal,
    title: meal.strMeal,
    ingredients: ingredients.map(({ ingredient, measure }) => ({
      name: ingredient,
      measure,
    })),
    instructions: meal.strInstructions,
    image: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
    isAiModified: false,
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:justify-center">
      <div className="w-full min-w-0 max-w-5xl space-y-6 lg:flex-1">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="relative w-full md:w-1/2 h-64 md:h-80">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              fill
              className="object-cover rounded-xl"
            />
          </div>

          {/* Basic info */}
          <div className="flex-1 space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold">{meal.strMeal}</h1>

            <div className="flex gap-3 text-sm">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                {meal.strCategory}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                {meal.strArea}
              </span>
            </div>
            <RecipeSaveButton recipe={recipeToSave} />

            {/* INGREDIENTS PREVIEW */}
            <div>
              <h2 className="font-semibold mb-2">Ingredients</h2>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {ingredients.map((item, index) => (
                  <li key={index}>
                    {item.measure && `${item.measure} `} {item.ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions will go here later with Markdown */}
        <MarkdownViewer markdown={meal.strInstructions} />
      </div>
      <Ai
        ingredients={ingredients}
        instructions={meal.strInstructions}
        meal={meal.strMeal}
        mealId={meal.idMeal}
        image={meal.strMealThumb}
        category={meal.strCategory}
        area={meal.strArea}
      />
    </main>
  );
}
