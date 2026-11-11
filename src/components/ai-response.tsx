"use client";

import React from "react";
import MarkdownViewer from "./markdown";
import { motion } from "motion/react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import RecipeSaveButton from "./recipe-save-button";
import type { RecipeSavePayload } from "@/types/recipe";

export default function AiResponse({
  response,
  meal,
  recipe,
  setResponseModal,
}: {
  response: string;
  meal: string;
  recipe: Omit<RecipeSavePayload, "instructions" | "isAiModified">;
  setResponseModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setResponseModal(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setResponseModal(false);
      }}
      className="fixed inset-0 z-50 flex justify-end bg-black/45 text-foreground backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Recipe suggestions for ${meal}`}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-border bg-background shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <div className="relative size-6">
                <Image src="/googlegemini.svg" alt="" fill />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">RecipeMind</p>
              <p className="truncate text-xs text-muted-foreground">{meal}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setResponseModal(false)}
            aria-label="Close recipe suggestions"
            className="shrink-0"
          >
            <X />
          </Button>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-7 sm:px-8 sm:py-10">
          <div className="mb-7 space-y-2">
            <p className="text-sm font-medium text-primary">Your recipe update</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Let&apos;s make it yours
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Here are tailored ideas for {meal}. Adjust anything to suit your
              taste and kitchen.
            </p>
          </div>
          <MarkdownViewer markdown={response} />
        </main>
        <footer className="flex flex-col gap-3 border-t border-border bg-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs text-muted-foreground">
            Check ingredient labels and cooking temperatures for your needs.
          </p>
          <RecipeSaveButton
            recipe={{
              ...recipe,
              instructions: response,
              isAiModified: true,
            }}
            savedLabel="Update saved AI recipe"
          />
        </footer>
      </motion.div>
    </div>
  );
}
