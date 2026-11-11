import { createHash } from "node:crypto";
import { hash, genSalt } from "bcrypt";
import { type NextRequest, NextResponse } from "next/server";
import { isEmail, isStrongPassword } from "validator";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    !("token" in body) ||
    typeof body.token !== "string" ||
    !("password" in body) ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const email = body.email.trim();
  if (!isEmail(email) || !body.token || !isStrongPassword(body.password)) {
    return NextResponse.json(
      { message: "The reset link is invalid or expired, or the password is too weak." },
      { status: 400 },
    );
  }

  try {
    await dbConnect();
    const tokenHash = createHash("sha256").update(body.token).digest("hex");
    const tokenQuery = {
      email,
      provider: "Credentials",
      passwordResetTokenHash: tokenHash,
    };
    const validToken = await User.findOne({
      ...tokenQuery,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("_id");

    if (!validToken) {
      return NextResponse.json(
        { message: "The reset link is invalid or expired." },
        { status: 400 },
      );
    }

    const salt = await genSalt();
    const passwordHash = await hash(body.password, salt);
    const user = await User.findOneAndUpdate(
      {
        ...tokenQuery,
        passwordResetExpiresAt: { $gt: new Date() },
      },
      {
        $set: { password: passwordHash },
        $unset: {
          passwordResetTokenHash: 1,
          passwordResetExpiresAt: 1,
          passwordResetRequestedAt: 1,
        },
      },
      { new: true },
    ).select("_id");

    if (!user) {
      return NextResponse.json(
        { message: "The reset link is invalid or expired." },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "Your password has been reset. You can now sign in." });
  } catch (error) {
    console.error("Password reset failed:", error);
    return NextResponse.json(
      { message: "Unable to reset your password right now. Please try again later." },
      { status: 500 },
    );
  }
}
