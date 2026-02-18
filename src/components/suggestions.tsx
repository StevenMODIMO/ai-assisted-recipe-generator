"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

interface MealsTypes {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function Suggestions({
  first_letter,
  setShowSuggestions,
}: {
  first_letter: string;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [meals, setMeals] = useState<MealsTypes[]>([]);

  useEffect(() => {
    const getMealsByLetter = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${first_letter}`,
        );
        const json = await response.json();

        if (json.meals) {
          setMeals(json.meals.slice(0, 5)); // limit to 5
        } else {
          setMeals([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getMealsByLetter();
  }, [first_letter]);

  return (
    <div
      onClick={() => setShowSuggestions(false)}
      className="absolute top-0 left-0 w-full h-full sm:bg-black/50 text-white backdrop-blur z-10 sm:flex sm:justify-end overflow-hidden"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        className="sm:w-[50%] h-full bg-white text-black p-4 lg:w-[25%] overflow-y-auto"
      >
        <header className="flex justify-end">
          <X
            className="cursor-pointer"
            onClick={() => setShowSuggestions(false)}
          />
        </header>

        <div className="mb-4">
          <h1 className="text-purple-500 text-lg font-semibold">
            Seems like the ingredient you are searching for is missing some
            recipes.
          </h1>
          <p className="text-sm text-gray-600">
            Here are some similar meals that might be close to what you are
            looking for.
          </p>
        </div>

        {/* Meals list */}
        <div className="space-y-3">
          {meals.map((meal) => (
            <Link
              key={meal.idMeal}
              href={`/recipe/${meal.idMeal}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setShowSuggestions(false)}
            >
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                width={50}
                height={50}
                className="rounded-md object-cover"
              />
              <span className="text-sm font-medium">{meal.strMeal}</span>
            </Link>
          ))}

          {meals.length === 0 && (
            <p className="text-sm text-gray-500">No suggestions found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
