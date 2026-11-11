"use client";

import { useState } from "react";
import { AlertCircle, Download, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import type { RecipePdfData } from "@/lib/recipe-pdf";

export default function RecipePdfDownload({
  recipe,
}: {
  recipe: RecipePdfData;
}) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setError("");

    try {
      const { downloadRecipePdf } = await import("@/lib/recipe-pdf");
      await downloadRecipePdf(recipe);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Unable to prepare the PDF. Please try again.",
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleDownload}
        disabled={downloading}
        className="w-full gap-2"
      >
        {downloading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Download />
        )}
        {downloading ? "Preparing PDF…" : "Download recipe PDF"}
      </Button>
      {error && (
        <p
          role="alert"
          className="flex items-start gap-1.5 text-xs text-destructive"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
