import Link from "next/link";
import Image from "next/image";

interface IngredientType {
  idIngredient: string;
  strDescription: string;
  strIngredient: string;
  strThumb: string;
}

export default async function FeaturedIngredients() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch ingredients");
  }

  const data = await response.json();
  const ingredients: IngredientType[] = data.meals.slice(0, 12); // choose how many featured

  return (
    <div className="lg:w-[60%] lg:mx-auto">
      <header className="font-semibold text-lg text-center md:text-start text-purple-500">
        <h1>Featured Ingredients</h1>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:grid lg:grid-cols-6">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.idIngredient}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative w-24 h-24 lg:w-32 lg:h-32">
              <Image
                src={`https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`}
                alt={ingredient.strIngredient}
                fill
                className="object-contain group-hover:scale-105 transition"
              />
            </div>
            <p className="mt-2 text-sm font-medium">
              {ingredient.strIngredient}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
