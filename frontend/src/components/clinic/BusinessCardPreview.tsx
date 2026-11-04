import Image from "next/image";
import { Download, MapPin, Phone } from "lucide-react";

const cardStyles = {
  front: "bg-[#123e46] text-white",
  back: "border border-[var(--brand-line)] bg-[var(--brand-surface)] text-[var(--brand-ink)]",
};

export function BusinessCardPreview() {
  return (
    <section className="px-4 py-20 sm:py-24" aria-labelledby="business-card-title" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="brand-overline">کارت ویزیت</p>
          <h2 id="business-card-title" className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)] sm:text-4xl">کارت ویزیت کلینیک</h2>
          <p className="mt-4 leading-8 text-[var(--brand-muted)]">تصویر روی کارت دریافت شده است. برای نمایش پشت کارت، منتظر دریافت تصویر آن هستیم.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="overflow-hidden rounded-[1.75rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] shadow-lg" aria-label="روی کارت ویزیت دکتر رحیمی">
            <div className="relative aspect-[1280/798] bg-white">
              <Image src="/images/general/dr-rahimi-business-card.jpg" alt="روی کارت ویزیت مرکز فیزیوتراپی دکتر عباس رحیمی؛ اطلاعات نظام پزشکی، ساعات کار و نشانی کلینیک" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
              <p className="text-sm font-bold text-[var(--brand-ink)]">روی کارت ویزیت</p>
              <a href="/images/general/dr-rahimi-business-card.jpg" download="dr-rahimi-business-card-front.jpg" className="brand-link-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--brand-line)] px-4 text-sm font-bold text-[var(--brand-ink)]"><Download aria-hidden="true" className="size-4" />دانلود تصویر</a>
            </div>
          </article>

          <article className={`flex min-h-64 flex-col justify-center rounded-[1.75rem] p-7 shadow-lg sm:p-9 ${cardStyles.back}`} aria-label="اطلاعات تماس کلینیک">
            <p className="text-xs font-bold tracking-wide text-[var(--brand-teal)]">پشت کارت ویزیت</p>
            <h3 className="mt-3 text-xl font-extrabold">تصویر پشت کارت هنوز دریافت نشده است</h3>
            <p className="mt-3 leading-8 text-[var(--brand-muted)]">پس از دریافت تصویر پشت کارت، آن را در همین بخش اضافه می‌کنیم.</p>
            <h3 className="mt-6 text-base font-extrabold">اطلاعات تماس موجود در سایت</h3>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--brand-copy)]">
              <a href="tel:02177402528" dir="ltr" className="brand-link-ring flex w-fit items-center gap-3 rounded-lg font-bold text-[var(--brand-ink)]"><Phone aria-hidden="true" className="size-4 text-[var(--brand-teal)]" />021-77402528</a>
              <a href="tel:02177466628" dir="ltr" className="brand-link-ring flex w-fit items-center gap-3 rounded-lg font-bold text-[var(--brand-ink)]"><Phone aria-hidden="true" className="size-4 text-[var(--brand-teal)]" />021-7746-6628</a>
              <p className="flex items-start gap-3"><MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-[var(--brand-teal)]" /><span>تهران، خیابان پیروزی، بین خیابان سوم و چهارم نیروی هوایی، پلاک ۱۲۵، ساختمان پزشکان ادیب</span></p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
