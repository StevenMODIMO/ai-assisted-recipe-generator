import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { put, del } from "@vercel/blob";
import { isStrongPassword, isEmail } from "validator";
import { hash, genSalt } from "bcrypt";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const avatar = formData.get("avatar") as File;

  if (!email || !password) {
    return NextResponse.json(
      { message: "All fields must be filled" },
      { status: 400 },
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json({ message: "Invalid Email" }, { status: 400 });
  }

  if (!isStrongPassword(password)) {
    return NextResponse.json({ message: "Weak Password" }, { status: 400 });
  }

  const exists = await User.findOne({ email });

  if (exists) {
    return NextResponse.json({
      message: "Email in use. Login instead.",
    });
  }

  const salt = await genSalt();
  const hashed = await hash(password, salt);

  let imageUrl = null;

  if (avatar instanceof File) {
    try {
      const { url } = await put(`cdn.recipe.users/${avatar.name}`, avatar, {
        access: "public",
        allowOverwrite: true,
      });
      imageUrl = url;
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      return NextResponse.json({ message: "Image upload failed" });
    }
  }

  try {
    const user = await User.create({
      email,
      password: hashed,
      avatar_url: imageUrl,
    });
    return NextResponse.json({ email, password, avatar_url: imageUrl });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ message: "Failed to create user", error });
  }
}
