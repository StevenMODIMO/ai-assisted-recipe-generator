"use client";
import Markdown from "react-markdown";

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  return (
    <div className="space-y-5 break-words text-sm leading-7 text-foreground sm:text-base">
      <Markdown
        components={{
          h1: ({ children }) => (
            <h2 className="border-b border-border pb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="border-b border-border pb-2 text-xl font-semibold tracking-tight sm:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold tracking-tight">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="leading-7 text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="ml-1 list-disc space-y-2 pl-5 marker:text-primary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-1 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-primary">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ps-1 leading-7 text-muted-foreground [&_strong]:text-foreground">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="rounded-r-lg border-l-4 border-primary bg-muted/60 px-4 py-3 text-muted-foreground [&_p]:m-0">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border" />,
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted text-foreground">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border px-4 py-3 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-border px-4 py-3 text-muted-foreground">
              {children}
            </td>
          ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm">
              {children}
            </pre>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
              {children}
            </code>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
