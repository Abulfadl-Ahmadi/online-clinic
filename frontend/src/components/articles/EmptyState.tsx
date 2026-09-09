"use client";

export default function EmptyState({ title = "موردی یافت نشد", description = "نتیجه‌ای برای نمایش وجود ندارد." }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center text-muted-foreground">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm">{description}</p>
    </div>
  );
}
