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
import { motion, type Variants } from "motion/react";
import { AlertCircle, ArrowRight, ChefHat, LoaderCircle, Search } from "lucide-react";

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

const itemVariants: Variants = {
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

    if (!ingredient.trim()) {
      setError("Please enter an ingredient.");
      return;
    }

    setError("");
    setLoading(true);
    setMeals([]);
    setShowSuggestions(false);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient.trim())}`,
      );
      if (!response.ok) {
        throw new Error("Recipe search is unavailable right now.");
      }
      const json = await response.json();

      if (json.meals) {
        setMeals(json.meals.slice(0, 6));
        setShowSuggestions(false);
      } else {
        setMeals([]);
        setShowSuggestions(true);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.4fr)]">
      {/* Suggestions panel */}
      {showSuggestions && (
        <Suggestions
          first_letter={ingredient.trim()[0] ?? ""}
          setShowSuggestions={setShowSuggestions}
        />
      )}

      <Card className="h-fit gap-0 border border-border/70 shadow-sm">
        <CardHeader className="gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ChefHat className="size-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl">
              What&apos;s in your kitchen?
            </CardTitle>
            <CardDescription className="leading-relaxed">
              Search for one ingredient to find meals you can make with it.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <label
              htmlFor="ingredient-search"
              className="text-sm font-medium text-foreground"
            >
              Ingredient
            </label>
            <Input
              id="ingredient-search"
              type="text"
              value={ingredient}
              onChange={(event) => {
                setIngredient(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Try chicken, rice, or tomato"
              autoComplete="off"
              disabled={loading}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "ingredient-search-error" : undefined}
              className="h-11 bg-background px-3 dark:bg-input/30"
            />

            {error && (
              <p
                id="ingredient-search-error"
                role="alert"
                className="flex items-start gap-2 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || !ingredient.trim()}
              className="h-10 w-full gap-2"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Finding recipes…
                </>
              ) : (
                <>
                  <Search />
                  Find recipes
                  <ArrowRight className="ml-auto" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <section
        aria-label="Recipe search results"
        aria-live="polite"
        className="min-w-0"
      >
        {meals.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">Your results</p>
                <h2 className="text-xl font-semibold tracking-tight">
                  Recipes to explore
                </h2>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                {meals.length} {meals.length === 1 ? "recipe" : "recipes"}
              </span>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {meals.map(({ idMeal, strMeal, strMealThumb }) => (
                <motion.div key={idMeal} variants={itemVariants}>
                  <Link
                    href={`/recipe/${idMeal}`}
                    className="group block h-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={strMealThumb}
                        alt={strMeal}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex min-h-20 items-center justify-between gap-3 p-4">
                      <p className="line-clamp-2 text-sm font-semibold leading-snug">
                        {strMeal}
                      </p>
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              {loading ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <Search className="size-5" />
              )}
            </div>
            <h2 className="font-semibold">
              {loading ? "Finding something delicious…" : "Your recipes will show up here"}
            </h2>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {loading
                ? "We’re looking for meals that use your ingredient."
                : "Search an ingredient to get started. Pick a recipe to see its ingredients and cooking instructions."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
