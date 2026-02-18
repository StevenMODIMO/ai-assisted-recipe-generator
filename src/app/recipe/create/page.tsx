import React from "react";
import IngredientsForm from "@/components/ingredients-form";

export default function Create() {
  return (
    <div className="flex flex-col gap-3">
      <header className="font-semibold text-lg text-center md:text-start text-purple-500">
        <h1>Make your own recipes</h1>
      </header>
      <IngredientsForm />
    </div>
  );
}
