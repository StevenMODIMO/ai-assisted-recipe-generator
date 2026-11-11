import { createHash, randomBytes } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { isEmail } from "validator";
import { dbConnect } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/password-reset-email";
import User from "@/models/User";

const genericMessage =
  "If an account exists for that email, reset instructions will be sent shortly.";
const resetTokenLifetimeMs = 30 * 60 * 1000;
const requestCooldownMs = 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      typeof body.email !== "string"
    ) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    const email = body.email.trim();
    if (!isEmail(email)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email, provider: "Credentials" }).select("_id email");
    if (!user) {
      return NextResponse.json({ message: genericMessage });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const now = new Date();
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        $or: [
          { passwordResetRequestedAt: { $exists: false } },
          { passwordResetRequestedAt: { $lte: new Date(now.getTime() - requestCooldownMs) } },
        ],
      },
      {
        $set: {
          passwordResetTokenHash: tokenHash,
          passwordResetExpiresAt: new Date(now.getTime() + resetTokenLifetimeMs),
          passwordResetRequestedAt: now,
        },
      },
      { new: true },
    ).select("email");

    if (updatedUser) {
      const baseUrl = process.env.NEXTAUTH_URL;
      if (!baseUrl) {
        throw new Error("NEXTAUTH_URL is not configured.");
      }

      const resetUrl = new URL("/reset-password", baseUrl);
      resetUrl.searchParams.set("email", updatedUser.email);
      resetUrl.searchParams.set("token", token);

      try {
        await sendPasswordResetEmail(updatedUser.email, resetUrl);
      } catch (error) {
        await User.updateOne(
          { _id: updatedUser._id, passwordResetTokenHash: tokenHash },
          {
            $unset: {
              passwordResetTokenHash: 1,
              passwordResetExpiresAt: 1,
              passwordResetRequestedAt: 1,
            },
          },
        );
        throw error;
      }
    }

    return NextResponse.json({ message: genericMessage });
  } catch (error) {
    console.error("Password reset email request failed:", error);
    return NextResponse.json(
      { message: "Unable to send reset instructions right now. Please try again later." },
      { status: 500 },
    );
  }
}
