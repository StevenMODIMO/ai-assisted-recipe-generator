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
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch ingredients");
  }

  const data = await response.json();
  const ingredients: IngredientType[] = data.meals.slice(0, 6); // choose how many featured

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {ingredients.map((ingredient) => (
        <Link
          key={ingredient.idIngredient}
          href={`/recipe/${ingredient.idIngredient}`}
          className="group flex flex-col items-center text-center"
        >
          <div className="relative w-24 h-24">
            <Image
              src={`https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`}
              alt={ingredient.strIngredient}
              fill
              className="object-contain group-hover:scale-105 transition"
            />
          </div>

          <p className="mt-2 text-sm font-medium">{ingredient.strIngredient}</p>
        </Link>
      ))}
    </div>
  );
}
