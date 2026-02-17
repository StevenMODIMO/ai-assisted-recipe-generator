"use client";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "./ui/card";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import Suggestions from "./suggestions";

interface MealsTypes {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function IngredientsForm() {
  const [ingredient, setIngredient] = useState("");
  const [suggestions, setShowSuggestions] = useState(false);
  const [meals, setMeals] = useState<MealsTypes[]>([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
        );
        const json = await response.json();

        if (response.ok) {
          console.log(json.meals.slice(0,10));
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchIngredients();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`,
      );
      const json = await response.json();
      if (json.meals) {
        setMeals(json.meals.slice(0, 10));
        console.log(meals);
        setShowSuggestions(false);
      } else {
        setShowSuggestions(true);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      {suggestions && (
        <Suggestions
          first_letter={ingredient[0]}
          setShowSuggestions={setShowSuggestions}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Enter Ingredients</CardTitle>
          <CardDescription>
            Ingredient item that will be used to generate a recipe.
          </CardDescription>
        </CardHeader>
        <section>
          {meals.length > 0 && (
            <div>
              {meals.map(({ idMeal, strMeal, strMealThumb }) => {
                return (
                  <div key={idMeal}>
                    <div className="relative w-24 h-24">
                      <Image
                        src={strMealThumb}
                        alt={strMeal}
                        fill
                        className="rounded"
                      />
                    </div>
                    <p>{strMeal}</p>
                    <Link
                      href={`/recipe/${idMeal}`}
                      className="underline text-sm text-green-500"
                    >
                      View Recipe
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              type="text"
              value={ingredient}
              onChange={(e) => {
                setIngredient(e.target.value);
              }}
              placeholder="Enter ingredient"
            />
            <Button className="w-full">Search recipe</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
