"use client";

import { useRef, useState } from "react";
import { Bold, Eye, Heading2, Italic, Link2, List, ListOrdered, Pencil, Quote } from "lucide-react";
import ArticleContent from "./ArticleContent";

interface MarkdownEditorProps {
  defaultValue?: string;
}

const tools = [
  { label: "عنوان میانی", icon: Heading2, prefix: "## ", suffix: "", sample: "عنوان بخش" },
  { label: "پررنگ", icon: Bold, prefix: "**", suffix: "**", sample: "متن پررنگ" },
  { label: "مورب", icon: Italic, prefix: "*", suffix: "*", sample: "متن مورب" },
  { label: "پیوند", icon: Link2, prefix: "[", suffix: "](https://example.com)", sample: "متن پیوند" },
  { label: "فهرست", icon: List, prefix: "- ", suffix: "", sample: "مورد فهرست" },
  { label: "فهرست شماره‌دار", icon: ListOrdered, prefix: "1. ", suffix: "", sample: "مورد فهرست" },
  { label: "نقل‌قول", icon: Quote, prefix: "> ", suffix: "", sample: "متن نقل‌قول" },
] as const;

export function MarkdownEditor({ defaultValue = "" }: MarkdownEditorProps) {
  const [content, setContent] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);

  function insert(prefix: string, suffix: string, sample: string) {
    const input = textarea.current;
    if (!input) return;
    const { selectionStart: start, selectionEnd: end } = input;
    const selected = content.slice(start, end) || sample;
    const text = `${prefix}${selected}${suffix}`;
    setContent(`${content.slice(0, start)}${text}${content.slice(end)}`);
    setPreview(false);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="content" className="font-semibold text-foreground">متن مقاله (Markdown)</label>
        <div role="group" aria-label="حالت نمایش متن مقاله" className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1">
          <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)} className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${!preview ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Pencil aria-hidden="true" className="size-4" />نوشتن</button>
          <button type="button" aria-pressed={preview} onClick={() => setPreview(true)} className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${preview ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Eye aria-hidden="true" className="size-4" />پیش‌نمایش</button>
        </div>
      </div>
      {!preview && <div role="toolbar" aria-label="ابزار قالب‌بندی Markdown" className="flex flex-wrap gap-1 rounded-xl border border-border bg-muted/30 p-2">
        {tools.map(({ label, icon: Icon, prefix, suffix, sample }) => (
          <button key={label} type="button" aria-label={label} title={label} onClick={() => insert(prefix, suffix, sample)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><Icon aria-hidden="true" className="size-4" /></button>
        ))}
      </div>}
      <textarea ref={textarea} id="content" name="content" value={content} onChange={(event) => setContent(event.target.value)} required aria-describedby="markdown-help" placeholder="## عنوان بخش\n\nتوضیح بخش را اینجا بنویسید…" dir="rtl" rows={18} className={`${preview ? "sr-only" : "block"} min-h-80 w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-base leading-8 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`} />
      {preview && <div aria-label="پیش‌نمایش مقاله" className="min-h-80 rounded-xl border border-border bg-card px-5 py-6 text-card-foreground sm:px-8">{content.trim() ? <ArticleContent content={content} /> : <p className="text-muted-foreground">هنوز متنی برای نمایش نوشته نشده است.</p>}</div>}
      <p id="markdown-help" className="text-sm leading-7 text-muted-foreground">برای عنوان از <code dir="ltr">##</code>، برای متن پررنگ از <code dir="ltr">**متن**</code> و برای فهرست از <code dir="ltr">-</code> استفاده کنید. پیش‌نمایش، متن ذخیره‌نشده را نشان می‌دهد؛ برای ذخیره از دکمهٔ پایین فرم استفاده کنید.</p>
    </div>
  );
}
