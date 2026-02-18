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
import { CircleArrowUp } from "lucide-react";
import { useState } from "react";

interface AiPropsTypes {
  instructions: string;
  meal: string;
  ingredients: { ingredient: string; measure: string }[];
}

export default function Ai({ instructions, meal, ingredients }: AiPropsTypes) {
  const [input, setInput] = useState("");
  console.log(ingredients);
  return (
    <div className="w-[30%] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <div className="relative w-6 h-6">
              <Image src="/googlegemini.svg" alt="image" fill />
            </div>
            <span>RecipeMind</span>
          </CardTitle>
          <CardDescription>
            Use our AI to create, improve, and personalize your recipes
            instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            <li
              onClick={() => setInput("Enhance flavour ")}
              className="bg-purple-300 border hover:bg-purple-500 cursor-pointer border-purple-500 p-2 rounded"
            >
              Enhance flavor
            </li>
            <li
              onClick={() => setInput("Simplify cooking steps ")}
              className="bg-purple-300 border hover:bg-purple-500 cursor-pointer border-purple-500 p-2 rounded"
            >
              Simplify cooking steps
            </li>
            <li
              onClick={() => setInput("Generate a recipe from ingredients ")}
              className="bg-purple-300 border hover:bg-purple-500 cursor-pointer border-purple-500 p-2 rounded"
            >
              Generate a recipe from ingredients
            </li>
            <li
              onClick={() => setInput("Modify for this diet ")}
              className="bg-purple-300 border hover:bg-purple-500 cursor-pointer border-purple-500 p-2 rounded"
            >
              Modify for a specific diet
            </li>
          </ul>
          <section>
            <form className="flex p-2 border border-purple-500 my-2 rounded">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border-0"
                placeholder="Ask a question"
              />
              <Button className="disabled:bg-mute bg-purple-500 hover:bg-purple-500 text-white">
                <CircleArrowUp />
              </Button>
            </form>
          </section>
        </CardContent>
        <CardFooter className="text-sm italic font-bold text-purple-500">
          Review answers for accuracy
        </CardFooter>
      </Card>
    </div>
  );
}
