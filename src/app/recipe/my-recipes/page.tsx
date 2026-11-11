"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookmarkCheck,
  ChefHat,
  Clock3,
  LoaderCircle,
  Search,
  Sparkles,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import MarkdownViewer from "@/components/markdown";
import RecipePdfDownload from "@/components/recipe-pdf-download";
import { Button } from "@/components/ui/button";

interface SavedRecipe {
  _id: string;
  sourceMealId: string;
  title: string;
  description?: string;
  ingredients: { name: string; measure?: string }[];
  instructions: string;
  image?: string;
  category?: string;
  area?: string;
  isAiModified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    setNeedsSignIn(false);

    try {
      const response = await fetch("/api/recipes");
      const result: {
        message?: string;
        recipes?: SavedRecipe[];
      } = await response.json();

      if (response.status === 401) {
        setNeedsSignIn(true);
        throw new Error("Sign in to see the recipes you’ve saved.");
      }
      if (!response.ok || !Array.isArray(result.recipes)) {
        throw new Error(result.message || "Unable to load your recipes.");
      }

      setRecipes(result.recipes);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load your recipes. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecipes();
  }, [loadRecipes]);

  const filteredRecipes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return recipes;
    return recipes.filter((recipe) =>
      [
        recipe.title,
        recipe.category,
        recipe.area,
        ...recipe.ingredients.map((ingredient) => ingredient.name),
      ]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase().includes(query)),
    );
  }, [recipes, search]);

  const deleteRecipe = async (recipe: SavedRecipe) => {
    setDeletingId(recipe._id);
    setDeleteError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/recipes?sourceMealId=${encodeURIComponent(recipe.sourceMealId)}`,
        { method: "DELETE" },
      );
      const result: { message?: string; deleted?: boolean } =
        await response.json();

      if (!response.ok || !result.deleted) {
        throw new Error(result.message || "Unable to delete this recipe.");
      }

      setRecipes((current) =>
        current.filter((savedRecipe) => savedRecipe._id !== recipe._id),
      );
      setConfirmDeleteId(null);
      setNotice(`${recipe.title} was removed from your saved recipes.`);
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete this recipe. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:py-12">
      <header className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-lime-50 via-background to-background p-6 dark:from-lime-950/30 dark:via-background dark:to-background sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium text-primary">
              <BookmarkCheck className="size-3.5" aria-hidden="true" />
              Your personal cookbook
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                My recipes
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Keep your favorite meals close, including any versions you’ve
                made your own with RecipeMind.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl border bg-background/80 px-4 py-3 sm:self-auto">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ChefHat className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-semibold leading-5">
                {loading ? "—" : recipes.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {recipes.length === 1 ? "saved recipe" : "saved recipes"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="saved-recipes-heading" className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2
              id="saved-recipes-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Your collection
            </h2>
            <p className="text-sm text-muted-foreground">
              {recipes.length
                ? "Open a recipe to see its saved ingredients and instructions."
                : "Recipes you save will be gathered here."}
            </p>
          </div>
          {recipes.length > 0 && (
            <label className="relative block w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your recipes"
                aria-label="Search saved recipes"
                className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              />
            </label>
          )}
        </div>

        {notice && (
          <p
            role="status"
            className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground"
          >
            {notice}
          </p>
        )}

        {loading ? (
          <div
            role="status"
            aria-label="Loading saved recipes"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border bg-card"
              >
                <div className="aspect-[16/10] animate-pulse bg-muted" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-9 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div
            role="alert"
            className="flex flex-col items-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center"
          >
            <AlertCircle className="mb-3 size-6 text-destructive" />
            <p className="font-medium">{loadError}</p>
            {needsSignIn ? (
              <Button asChild className="mt-4">
                <Link
                  href={`/signin?callbackUrl=${encodeURIComponent("/recipe/my-recipes")}`}
                >
                  Sign in
                  <ArrowRight />
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => void loadRecipes()}
                className="mt-4"
              >
                Try again
              </Button>
            )}
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UtensilsCrossed className="size-6" />
            </div>
            <h3 className="text-lg font-semibold">Your cookbook is ready</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Find a meal you love and save it here. If you ask RecipeMind to
              tweak it, you can save that version instead.
            </p>
            <Button asChild className="mt-5 gap-2">
              <Link href="/recipe/create">
                Find a recipe
                <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
            <Search className="mb-3 size-6 text-muted-foreground" />
            <h3 className="font-semibold">No recipes match that search</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different recipe, ingredient, or category.
            </p>
          </div>
        ) : (
          <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <article
                key={recipe._id}
                className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <ChefHat className="size-10" />
                    </div>
                  )}
                  {recipe.isAiModified && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
                      <Sparkles className="size-3.5 text-primary" />
                      AI tweaked
                    </span>
                  )}
                </div>

                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <h3 className="line-clamp-2 text-lg font-semibold leading-snug">
                      {recipe.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {recipe.category && (
                        <span className="rounded-full bg-muted px-2.5 py-1">
                          {recipe.category}
                        </span>
                      )}
                      {recipe.area && (
                        <span className="rounded-full bg-muted px-2.5 py-1">
                          {recipe.area}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="size-3.5" />
                        Saved{" "}
                        {new Date(recipe.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {recipe.description && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {recipe.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
                    <span className="font-medium">Ingredients</span>
                    <span className="text-muted-foreground">
                      {recipe.ingredients.length}{" "}
                      {recipe.ingredients.length === 1
                        ? "ingredient"
                        : "ingredients"}
                    </span>
                  </div>

                  <RecipePdfDownload recipe={recipe} />

                  <details className="group rounded-lg border border-border">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                      View saved recipe
                      <ArrowRight className="size-4 rotate-90 transition-transform group-open:-rotate-90" />
                    </summary>
                    <div className="space-y-4 border-t border-border p-3">
                      <section>
                        <h4 className="mb-2 text-sm font-semibold">
                          Ingredients
                        </h4>
                        <ul className="grid gap-1.5 text-sm text-muted-foreground">
                          {recipe.ingredients.map((ingredient, index) => (
                            <li
                              key={`${ingredient.name}-${index}`}
                              className="flex gap-2"
                            >
                              <span className="text-primary">•</span>
                              <span>
                                {ingredient.measure && (
                                  <span className="font-medium text-foreground">
                                    {ingredient.measure}{" "}
                                  </span>
                                )}
                                {ingredient.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section className="border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-semibold">
                          Instructions
                        </h4>
                        <MarkdownViewer markdown={recipe.instructions} />
                      </section>
                    </div>
                  </details>

                  {confirmDeleteId === recipe._id ? (
                    <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                      <p className="text-sm font-medium">
                        Remove this recipe from your collection?
                      </p>
                      {deleteError && (
                        <p role="alert" className="text-xs text-destructive">
                          {deleteError}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => void deleteRecipe(recipe)}
                          disabled={deletingId === recipe._id}
                          className="gap-2"
                        >
                          {deletingId === recipe._id ? (
                            <LoaderCircle className="animate-spin" />
                          ) : (
                            <Trash2 />
                          )}
                          {deletingId === recipe._id
                            ? "Removing…"
                            : "Yes, remove"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setConfirmDeleteId(null);
                            setDeleteError("");
                          }}
                          disabled={deletingId === recipe._id}
                        >
                          Keep recipe
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setConfirmDeleteId(recipe._id);
                        setDeleteError("");
                      }}
                      className="w-full gap-2 text-muted-foreground hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                    >
                      <Trash2 />
                      Remove from My Recipes
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
