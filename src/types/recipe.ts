export interface RecipeSaveIngredient {
  name: string;
  measure: string;
}

export interface RecipeSavePayload {
  sourceMealId: string;
  title: string;
  description?: string;
  ingredients: RecipeSaveIngredient[];
  instructions: string;
  image?: string;
  category?: string;
  area?: string;
  isAiModified: boolean;
}
