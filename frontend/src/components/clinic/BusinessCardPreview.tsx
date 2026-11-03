import { Activity, MapPin, Phone } from "lucide-react";

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
          <h2 id="business-card-title" className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)] sm:text-4xl">نمونهٔ موقت کارت ویزیت کلینیک</h2>
          <p className="mt-4 leading-8 text-[var(--brand-muted)]">این طرح صرفاً پیش‌نمایش موقت است و پس از دریافت فایل اصلی کارت، با تصویر واقعی روی و پشت کارت جایگزین می‌شود.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className={`relative isolate overflow-hidden rounded-[1.75rem] p-7 shadow-lg sm:p-9 ${cardStyles.front}`} aria-label="پیش‌نمایش روی کارت ویزیت">
            <div className="pointer-events-none absolute -end-16 -top-20 -z-10 size-64 rounded-full border-[32px] border-white/5" aria-hidden="true" />
            <div className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3">
              <Activity aria-hidden="true" className="size-7 text-[#b8ded7]" />
              <span className="text-sm font-bold">مرکز فیزیوتراپی</span>
            </div>
            <p className="mt-10 text-xs font-bold tracking-wide text-[#b8ded7]">روی کارت · پیش‌نمایش موقت</p>
            <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">دکتر عباس رحیمی</h3>
            <p className="mt-2 text-sm leading-7 text-white/75">فیزیوتراپی و توان‌بخشی</p>
          </article>

          <article className={`relative overflow-hidden rounded-[1.75rem] p-7 shadow-lg sm:p-9 ${cardStyles.back}`} aria-label="پیش‌نمایش پشت کارت ویزیت">
            <p className="text-xs font-bold tracking-wide text-[var(--brand-teal)]">پشت کارت · پیش‌نمایش موقت</p>
            <h3 className="mt-3 text-xl font-extrabold">راه‌های ارتباط با کلینیک</h3>
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
