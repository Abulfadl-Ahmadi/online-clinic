"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

interface ArticleSummaryProps {
  summary: string;
}

export default function ArticleSummary({ summary }: ArticleSummaryProps) {
  // Customize the sanitize schema
  const customSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), "span", "strong", "em"],
    attributes: {
      ...defaultSchema.attributes,
      "*": ["className"],
    },
  };

  return (
    <div className="text-lg text-muted-foreground border-r-4 border-primary pr-4 prose prose-neutral dark:prose-invert prose-p:my-1">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, customSchema],
        ]}
      >
        {summary}
      </ReactMarkdown>
    </div>
  );
}
