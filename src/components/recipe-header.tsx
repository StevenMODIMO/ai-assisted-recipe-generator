"use client";
import Link from "next/link";
import React from "react";
import { CookingPot, Soup, Salad, NotepadText } from "lucide-react";
import { usePathname } from "next/navigation";

export default function RecipeHeader() {
  const path = usePathname();
  return (
    <div
      className="fixed bottom-2 left-1/2 -translate-x-1/2
 w-fit px-4 rounded mx-auto bg-black/80 text-white backdrop-blur z-8"
    >
      <nav className="flex items-center gap-6">
        <Link href="/recipe" className="flex items-center gap-2 p-2">
          <Salad className={`w-6 h-6 ${path === "/recipe" && "text-purple-500"}`} />
          <span className="hidden md:block md:text-sm font-medium">Overview</span>
        </Link>
        <Link href="/recipe/create" className={`flex items-center gap-2`}>
          <Soup className={`w-6 h-6 ${path === "/recipe/create" && "text-purple-500"}`} />
          <span className="hidden md:block md:text-sm font-medium">Create</span>
        </Link>
        <Link href="/recipe/my-recipes" className={`flex items-center gap-2`}>
          <CookingPot className={`w-6 h-6 ${path === "/recipe/my-recipes" && "text-purple-500"}`} />
          <span className="hidden md:block md:text-sm font-medium">My Recipes</span>
        </Link>
        <div className="flex items-center gap-2">
          <NotepadText className="w-6 h-6 text-gray-500" />
          <span className="hidden md:block md:text-sm text-gray-500 font-medium">Planner</span>
        </div>
      </nav>
    </div>
  );
}
