import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface IngredientType {
  idIngredient: string;
  strDescription: string;
  strIngredient: string;
  strThumb: string;
}

export default async function FeaturedIngredients() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch ingredients");
  }

  const data = await response.json();
  const ingredients: IngredientType[] = data.meals.slice(0, 12);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-1 pb-10">
      <header className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-lime-50 via-background to-background p-6 dark:from-lime-950/30 dark:via-background dark:to-background sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-600/20 bg-background/80 px-3 py-1 text-xs font-medium text-lime-700 dark:border-lime-400/20 dark:text-lime-300">
              <Sparkles className="size-3.5" aria-hidden="true" />
              A little inspiration for your kitchen
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                What are you craving?
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Start with an ingredient you love and discover recipes to make
                something delicious.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl border bg-background/80 px-4 py-3 sm:self-auto">
            <span className="flex size-10 items-center justify-center rounded-xl bg-lime-500/10 text-lime-700 dark:text-lime-300">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-semibold leading-5">{ingredients.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                ingredients to explore
              </p>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="featured-ingredients-heading" className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h2
              id="featured-ingredients-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Featured ingredients
            </h2>
            <p className="text-sm text-muted-foreground">
              Pick one to see meals you can make with it.
            </p>
          </div>
          <span className="hidden text-sm font-medium text-muted-foreground sm:block">
            {ingredients.length} picks
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {ingredients.map((ingredient) => (
            <Link
              key={ingredient.idIngredient}
              href={`/recipe/ingredient-${ingredient.idIngredient}`}
              className="group rounded-2xl border bg-card p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-lime-600/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-4"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/60">
                <Image
                  src={`https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`}
                  alt={ingredient.strIngredient}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 16vw"
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-1 pt-3">
                <span className="truncate text-sm font-medium">
                  {ingredient.strIngredient}
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime-600 dark:group-hover:text-lime-400"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
