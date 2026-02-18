import Image from "next/image";

interface MealType {
  strMeal: string;
  strInstructions: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
}

function getIngredients(meal: any) {
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

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${slug}`,
    { cache: "no-store" }
  );

  const data = await response.json();
  const meal = data.meals?.[0];

  if (!meal) {
    return <div className="p-6">Recipe not found.</div>;
  }

  const ingredients = getIngredients(meal);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
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
      {/* <Markdown>{meal.strInstructions}</Markdown> */}
    </div>
  );
}
