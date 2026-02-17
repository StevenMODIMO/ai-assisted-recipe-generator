"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Suggestions({
  first_letter,
  setShowSuggestions,
}: {
  first_letter: string;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    const getMealsByLetter = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${first_letter}`,
        );
        const json = await response.json();

        if (json.meals) {
          console.log(json.meals.slice(0, 10));
        } else {
          console.log(json);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getMealsByLetter();
  }, [first_letter]);
  return (
    <div className="absolute top-0 left-0 sm:static w-full h-screen sm:w-23 sm:h-23 bg-black/50">
      <header>
        <h1>Seesm like the ingredient you are searching for has no recipe.</h1>
        <p>
          Here are some similar meals that might be close to what you are
          looking for.
        </p>
      </header>
      <X onClick={() => setShowSuggestions(false)} />
      <p>{first_letter}</p>
    </div>
  );
}
