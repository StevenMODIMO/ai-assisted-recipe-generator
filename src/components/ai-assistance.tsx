"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { AlertCircle, CircleArrowUp, LoaderCircle, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import AiResponse from "./ai-response";
import type { RecipeSavePayload } from "@/types/recipe";

interface AiPropsTypes {
  instructions: string;
  meal: string;
  mealId: string;
  image: string;
  category: string;
  area: string;
  ingredients: { ingredient: string; measure: string }[];
}

const suggestions = [
  "Enhance the flavor",
  "Simplify the cooking steps",
  "Suggest a vegetarian variation",
  "Adapt this for a specific diet",
];

export default function Ai({
  instructions,
  meal,
  mealId,
  image,
  category,
  area,
  ingredients,
}: AiPropsTypes) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseModal, setResponseModal] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");
  const recipeDetails: Omit<RecipeSavePayload, "instructions" | "isAiModified"> =
    {
      sourceMealId: mealId,
      title: meal,
      ingredients: ingredients.map(({ ingredient, measure }) => ({
        name: ingredient,
        measure,
      })),
      image,
      category,
      area,
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const request = input.trim();
    if (!request || loading) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meal, instructions, ingredients, input: request }),
      });

      const json: { result?: unknown; error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "We couldn't create your recipe update.");
      }

      if (typeof json.result !== "string" || !json.result.trim()) {
        throw new Error("The recipe assistant returned an empty response. Please try again.");
      }

      setAiResponse(json.result);
      setResponseModal(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="mx-auto w-full max-w-xl lg:mx-0 lg:w-[min(100%,24rem)] lg:shrink-0">
      {responseModal && (
        <AiResponse
          response={aiResponse}
          meal={meal}
          recipe={recipeDetails}
          setResponseModal={setResponseModal}
        />
      )}
      <Card className="gap-0 border border-border/70 shadow-sm">
        <CardHeader className="gap-3 px-5 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
              <div className="relative size-6">
                <Image src="/googlegemini.svg" alt="" fill />
              </div>
            </div>
            <div className="min-w-0">
              <CardTitle>RecipeMind</CardTitle>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Your cooking companion
              </p>
            </div>
          </div>
          <CardDescription className="leading-relaxed">
            Make <span className="font-medium text-foreground">{meal}</span> your
            own. Ask for a tweak or choose an idea below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-5 pb-5 pt-5">
          <section aria-label="Recipe ideas" className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Try an idea
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setInput(suggestion);
                    setError("");
                  }}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </section>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label
              htmlFor="recipe-tweak"
              className="block text-sm font-medium text-foreground"
            >
              What would you like to change?
            </label>
            <div className="rounded-xl border border-input bg-background p-2 transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
              <Textarea
                id="recipe-tweak"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (error) setError("");
                }}
                className="min-h-24 resize-y border-0 bg-transparent px-2 py-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
                placeholder="e.g. Make it spicier and reduce the prep time…"
                maxLength={500}
                disabled={loading}
                aria-describedby="recipe-tweak-hint"
              />
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-2">
                <span id="recipe-tweak-hint" className="text-xs text-muted-foreground">
                  {input.length}/500
                </span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading || !input.trim()}
                  className="gap-2 rounded-lg"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      Thinking…
                    </>
                  ) : (
                    <>
                      <Sparkles />
                      Get suggestions
                      <CircleArrowUp />
                    </>
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="gap-2 px-5 py-3 text-xs font-normal text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          AI suggestions can be imperfect — review before cooking.
        </CardFooter>
      </Card>
    </aside>
  );
}
