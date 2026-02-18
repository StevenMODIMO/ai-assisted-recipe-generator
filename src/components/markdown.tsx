"use client";
import Markdown from "react-markdown";

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  return (
    <div>
      <Markdown>{markdown}</Markdown>
    </div>
  );
}
