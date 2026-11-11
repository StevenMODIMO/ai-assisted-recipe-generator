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

    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    sourceMealId: { type: String },

    isAiModified: { type: Boolean, default: false },

    favorites: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

RecipeSchema.index(
  { user: 1, sourceMealId: 1 },
  {
    unique: true,
    partialFilterExpression: { sourceMealId: { $type: "string" } },
  },
);

export default models.Recipe || model("Recipe", RecipeSchema);
