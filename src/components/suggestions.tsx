"use client";
import { useEffect, useState } from "react";
import { AlertCircle, LoaderCircle, Sparkles, X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const getMealsByLetter = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${encodeURIComponent(first_letter)}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("We couldn't load recipe suggestions.");
        }
        const json = await response.json();

        if (json.meals) {
          setMeals(json.meals.slice(0, 5));
        } else {
          setMeals([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setError(
          error instanceof Error
            ? error.message
            : "We couldn't load recipe suggestions.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    getMealsByLetter();
    return () => controller.abort();
  }, [first_letter]);

  return (
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setShowSuggestions(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setShowSuggestions(false);
      }}
      className="fixed inset-0 z-50 flex justify-end bg-black/45 text-foreground backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="suggestions-title"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-border bg-background p-5 shadow-2xl sm:p-7"
      >
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowSuggestions(false)}
            aria-label="Close suggestions"
          >
            <X />
          </Button>
        </header>

        <div className="mb-6 space-y-2">
          <p className="text-sm font-medium text-primary">A little inspiration</p>
          <h2 id="suggestions-title" className="text-2xl font-bold tracking-tight">
            No exact matches yet
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Here are a few other meals to explore while you try a different
            ingredient.
          </p>
        </div>

        <div className="space-y-2">
          {meals.map((meal) => (
            <Link
              key={meal.idMeal}
              href={`/recipe/${meal.idMeal}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-muted/60"
              onClick={() => setShowSuggestions(false)}
            >
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                width={64}
                height={64}
                className="size-16 rounded-lg object-cover"
              />
              <span className="text-sm font-medium group-hover:text-primary">
                {meal.strMeal}
              </span>
            </Link>
          ))}

          {loading && (
            <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Finding some ideas…
            </p>
          )}
          {error && (
            <p role="alert" className="flex items-start gap-2 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}
          {!loading && !error && meals.length === 0 && (
            <p className="py-3 text-sm text-muted-foreground">
              No suggestions found this time. Try another ingredient.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
