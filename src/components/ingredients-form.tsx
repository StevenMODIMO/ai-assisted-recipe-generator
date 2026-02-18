"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import Suggestions from "./suggestions";
import { motion } from "motion/react";

interface MealsTypes {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants:any = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function IngredientsForm() {
  const [ingredient, setIngredient] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [meals, setMeals] = useState<MealsTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ validation
    if (!ingredient.trim()) {
      setError("Please enter an ingredient.");
      return;
    }

    setError("");
    setLoading(true);
    setMeals([]);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`,
      );
      const json = await response.json();

      if (json.meals) {
        setMeals(json.meals.slice(0, 6));
        setShowSuggestions(false);
      } else {
        setMeals([]);
        setShowSuggestions(true);
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:flex lg:gap-4">
      {/* Suggestions panel */}
      {showSuggestions && (
        <Suggestions
          first_letter={ingredient[0]}
          setShowSuggestions={setShowSuggestions}
        />
      )}

      <Card className="lg:w-[40%]">
        <CardHeader>
          <CardTitle className="text-xl text-purple-500">
            Find Recipes by Ingredient
          </CardTitle>
          <CardDescription>
            Enter a single ingredient and discover meals you can cook.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            onFocus={() => setError(null)}
            className="flex flex-col gap-2"
          >
            <Input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="e.g. chicken, rice, tomato..."
            />

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <Button disabled={loading} className="bg-purple-500 text-white hover:bg-purple-600">
              {loading ? "Searching..." : "Search recipe"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="lg:w-[60%]">
        {/* RESULTS */}
        {meals.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {meals.map(({ idMeal, strMeal, strMealThumb }) => (
              <motion.div key={idMeal} variants={itemVariants}>
                <Link
                  key={idMeal}
                  href={`/recipe/${idMeal}`}
                  className="group rounded-xl overflow-hidden border hover:shadow-md transition"
                >
                  <div className="relative w-full h-28">
                    <Image
                      src={strMealThumb}
                      alt={strMeal}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  <div className="p-2">
                    <p className="text-sm font-semibold line-clamp-2">
                      {strMeal}
                    </p>
                    <p className="text-xs text-green-600 mt-1">View recipe →</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* EMPTY STATE */}
        {!loading && meals.length === 0 && !showSuggestions && (
          <p className="text-sm text-gray-500 text-center pt-2">
            No recipes yet. Try searching for an ingredient.
          </p>
        )}
      </div>
    </div>
  );
}
