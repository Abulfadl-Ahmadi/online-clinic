"use client";

import DOMPurify from "isomorphic-dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const looksLikeHtml = content?.trim().startsWith("<");
  
  // Customize the sanitize schema to allow specific HTML tags and attributes
  const customSchema = {
    ...defaultSchema,
    tagNames: [
      ...(defaultSchema.tagNames || []),
      "img",
      "div",
      "span",
      "figure",
      "figcaption",
    ],
    attributes: {
      ...defaultSchema.attributes,
      img: ["src", "alt", "width", "height", "style", "class"],
      div: ["style", "class"],
      span: ["style", "class"],
      figure: ["style", "class"],
      figcaption: ["style", "class"],
      a: ["href", "title", "target", "rel"],
      "*": ["className", "style"],
    },
  };
  
  if (looksLikeHtml) {
    // Render HTML content with sanitization
    return (
      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    );
  }
  
  // Render Markdown content with enhanced support for HTML elements
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw, // Process raw HTML elements
          [rehypeSanitize, customSchema], // Sanitize with custom schema
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
