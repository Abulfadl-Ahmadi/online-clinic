import { ArrowLeft, ClipboardCheck, HeartHandshake, House, ShieldCheck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const options = [
  {
    icon: House,
    title: "فیزیوتراپی در منزل",
    description: "برای افرادی که امکان حضور در کلینیک ندارند؛ به‌ویژه در دوران پس از جراحی، شکستگی یا مشکلات حرکتی ناشی از سکته، ام‌اس و پارکینسون. درخواست خدمات با تماس تلفنی بررسی می‌شود.",
    detail: "با فیزیوتراپیست مجرب و بیش از ۱۰ سال سابقه",
  },
  {
    icon: ClipboardCheck,
    title: "واحد ارزیابی تخصصی",
    description: "فیزیوتراپیست با استفاده از اسکن کف پا و آنالیز ستون فقرات و اندام‌ها، در صورت نیاز معاینهٔ دفورمیتی‌ها و برنامه‌ریزی درمان را دقیق‌تر انجام می‌دهد.",
    detail: "برای اطلاع از روز و ساعت فعال، با کلینیک هماهنگ کنید",
  },
  {
    icon: ShieldCheck,
    title: "پوشش بیمه‌ای",
    description: "کلینیک با تأمین اجتماعی، خدمات درمانی (بیمه سلامت)، نیروهای مسلح، بانک مرکزی و بیمه کمک‌رسان SOS طرف قرارداد است. شرایط پوشش را هنگام هماهنگی نوبت بپرسید.",
    detail: "هماهنگی جزئیات پوشش پیش از مراجعه",
  },
];

export function CareOptions() {
  return (
    <section className="px-4 py-20 sm:py-28" aria-labelledby="care-options-title">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="brand-overline">فراتر از جلسهٔ درمان</p>
            <h2 id="care-options-title" className="mt-3 text-3xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-4xl">مراقبت، متناسب با شرایط شما</h2>
            <p className="mt-4 leading-8 text-[var(--brand-muted)]">از ارزیابی تخصصی تا ادامهٔ درمان در خانه، مسیر مناسب شما را با هم پیدا می‌کنیم.</p>
          </div>
          <HeartHandshake aria-hidden="true" className="hidden size-12 text-[var(--brand-teal)] md:block" />
        </Reveal>
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3" stagger={0.06}>
          {options.map((option) => {
            const Icon = option.icon;
            return <StaggerItem key={option.title} className="h-full"><article className="brand-card flex h-full flex-col rounded-[1.5rem] p-7 sm:p-8">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand-ink)]"><Icon aria-hidden="true" className="size-6" /></div>
              <h3 className="mt-7 text-xl font-extrabold text-[var(--brand-ink)]">{option.title}</h3>
              <p className="mt-3 flex-1 leading-8 text-[var(--brand-muted)]">{option.description}</p>
              <p className="mt-7 border-t border-[var(--brand-line)] pt-5 text-sm font-bold text-[var(--brand-teal)]">{option.detail}</p>
            </article></StaggerItem>;
          })}
        </Stagger>
        <Reveal className="mt-8"><a href="tel:02177466628" className="brand-link-ring inline-flex min-h-11 items-center gap-2 font-bold text-[var(--brand-ink)] hover:text-[var(--brand-wine)]">برای هماهنگی و پرسش دربارهٔ خدمات تماس بگیرید <ArrowLeft aria-hidden="true" className="size-4" /></a></Reveal>
      </div>
    </section>
  );
}
