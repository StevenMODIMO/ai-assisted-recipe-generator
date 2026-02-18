import { Schema, model, models, Types } from "mongoose";

const IngredientSchema = new Schema(
  {
    name: { type: String, required: true },
    measure: { type: String },
  },
  { _id: false },
);

const RecipeSchema = new Schema(
  {
    title: { type: String, required: true },

    description: { type: String },

    ingredients: [IngredientSchema],

    instructions: { type: String, required: true },

    image: { type: String },

    category: { type: String },

    area: { type: String },

    // 🔗 OWNER
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⭐ engagement
    favorites: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    // 🕓 timestamps
  },
  { timestamps: true },
);

export default models.Recipe || model("Recipe", RecipeSchema);
