import IngredientsForm from "@/components/ingredients-form";
import { ChefHat, Sparkles } from "lucide-react";

export default function Create() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          Your next meal starts here
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Make something delicious
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Tell us what you have on hand and discover recipes made for your
          kitchen.
        </p>
      </header>
      <div className="mx-auto max-w-6xl">
        <IngredientsForm />
      </div>
      <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <ChefHat className="size-4 text-primary" />
        Simple ingredients, inspiring ideas, and a little help from Recipely.
      </p>
    </main>
  );
}
