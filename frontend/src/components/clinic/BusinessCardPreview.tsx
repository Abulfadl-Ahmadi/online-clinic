import Image from "next/image";
import { Download } from "lucide-react";

export function BusinessCardPreview() {
  return (
    <section className="px-4 py-20 sm:py-24" aria-labelledby="business-card-title" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="brand-overline">کارت ویزیت</p>
          <h2 id="business-card-title" className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)] sm:text-4xl">کارت ویزیت کلینیک</h2>

        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <article className="overflow-hidden rounded-[1.75rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] shadow-lg" aria-label="روی کارت ویزیت دکتر رحیمی">
            <div className="relative aspect-[1280/798] bg-white">
              <Image src="/images/general/dr-rahimi-business-card.jpg" alt="روی کارت ویزیت مرکز فیزیوتراپی دکتر عباس رحیمی؛ اطلاعات نظام پزشکی، ساعات کار و نشانی کلینیک" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
              <p className="text-sm font-bold text-[var(--brand-ink)]">روی کارت ویزیت</p>
              <a href="/images/general/dr-rahimi-business-card.jpg" download="dr-rahimi-business-card-front.jpg" className="brand-link-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--brand-line)] px-4 text-sm font-bold text-[var(--brand-ink)]"><Download aria-hidden="true" className="size-4" />دانلود تصویر</a>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
