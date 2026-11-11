"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookmarkCheck, BookmarkPlus, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import type { RecipeSavePayload } from "@/types/recipe";

export default function RecipeSaveButton({
  recipe,
  savedLabel = "Update saved recipe",
}: {
  recipe: RecipeSavePayload;
  savedLabel?: string;
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      `/api/recipes?sourceMealId=${encodeURIComponent(recipe.sourceMealId)}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        if (response.status === 401) return;
        if (!response.ok) {
          throw new Error("Unable to check whether this recipe is saved.");
        }
        const result: { isSaved?: boolean } = await response.json();
        if (!controller.signal.aborted) setIsSaved(result.isSaved === true);
      })
      .catch((fetchError: unknown) => {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          return;
        }
        if (!controller.signal.aborted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to check whether this recipe is saved.",
          );
        }
      });

    return () => controller.abort();
  }, [recipe.sourceMealId]);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setError("");
    setNeedsSignIn(false);

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });
      const result: { message?: string; isSaved?: boolean } =
        await response.json();

      if (response.status === 401) {
        setNeedsSignIn(true);
        throw new Error("Sign in to save this recipe to your collection.");
      }
      if (!response.ok || !result.isSaved) {
        throw new Error(result.message || "Unable to save this recipe.");
      }

      setIsSaved(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this recipe. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2" aria-busy={isSaving}>
      <Button
        type="button"
        variant={isSaved ? "secondary" : "default"}
        onClick={handleSave}
        disabled={isSaving}
        className="gap-2"
      >
        {isSaving ? (
          <LoaderCircle className="animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="text-primary" />
        ) : (
          <BookmarkPlus />
        )}
        <span aria-live="polite">
          {isSaving
            ? isSaved
              ? "Updating saved recipe…"
              : "Saving recipe…"
            : isSaved
              ? savedLabel
              : "Save to My Recipes"}
        </span>
      </Button>
      {isSaved && !isSaving && (
        <p
          role="status"
          className="flex items-center gap-1.5 text-xs font-medium text-primary"
        >
          <BookmarkCheck className="size-3.5" />
          Saved to My Recipes
        </p>
      )}
      {error && (
        <p role="alert" className="max-w-xs text-xs text-destructive">
          {needsSignIn ? (
            <>
              Sign in to save this recipe.{" "}
              <Link
                href={`/signin?callbackUrl=${encodeURIComponent(
                  typeof window === "undefined" ? "/recipe" : window.location.pathname,
                )}`}
                className="font-medium underline underline-offset-2"
              >
                Sign in
              </Link>
            </>
          ) : (
            error
          )}
        </p>
      )}
    </div>
  );
}
