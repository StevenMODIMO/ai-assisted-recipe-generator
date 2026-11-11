import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: String,
    password: String,
    avatar_url: String,
    provider: { type: String, default: "Credentials" },
    passwordResetTokenHash: String,
    passwordResetExpiresAt: Date,
    passwordResetRequestedAt: Date,
  },
  { timestamps: true },
);

export default models.User || model("User", userSchema);
