import Link from "next/link";
import { ArrowLeft, BookOpenText, GraduationCap, Landmark, Quote } from "lucide-react";

import { Footer } from "@/components/layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { PublicPageHero } from "@/components/clinic/PublicPageHero";

const education = [
  { degree: "کارشناسی فیزیوتراپی", institution: "دانشگاه علوم پزشکی شیراز" },
  { degree: "کارشناسی ارشد فیزیوتراپی", institution: "دانشگاه علوم پزشکی تهران" },
  { degree: "دکترای تخصصی فیزیوتراپی با تمرکز بر آسیب‌های ورزشی", institution: "دانشگاه ناتینگهام انگلستان، ۲۰۰۱" },
];

const timeline = [
  { year: "۱۳۷۱", title: "آغاز فعالیت بالینی", detail: "شروع فعالیت حرفه‌ای در کلینیک میدان خانی‌آباد نو و سپس بیمارستان فجر." },
  { year: "۱۳۷۶", title: "ادامهٔ تحصیل در انگلستان", detail: "آغاز دورهٔ دکترای تخصصی فیزیوتراپی در دانشگاه ناتینگهام." },
  { year: "پیروزی", title: "کلینیک شخصی در شرق تهران", detail: "ادامهٔ فعالیت بالینی در کلینیک فیزیوتراپی دکتر رحیمی در خیابان پیروزی." },
  { year: "امروز", title: "آموزش، پژوهش و درمان", detail: "استاد تمام دانشگاه علوم پزشکی شهید بهشتی در کنار فعالیت بالینی مستمر." },
];

export default function AboutUsPage() {
  return (
    <div className="brand-page min-h-screen" dir="rtl">
      <ScrollProgress />
      <PublicPageHero eyebrow="دربارهٔ دکتر عباس رحیمی" title="دانش دانشگاهی در کنار تجربهٔ بالینی" description="دکتر عباس رحیمی، فیزیوتراپیست و استاد تمام دانشکدهٔ توان‌بخشی دانشگاه علوم پزشکی شهید بهشتی، بیش از دو دهه است که در آموزش، پژوهش و درمان بیماران فعالیت می‌کند." image="/images/brand/dr-abbas-rahimi-hero.png" imageAlt="دکتر عباس رحیمی در محیط کلینیک فیزیوتراپی" caption="دکتر عباس رحیمی، استاد تمام دانشگاه علوم پزشکی شهید بهشتی">
        <p className="mt-5 border-s-2 border-[var(--brand-teal)] ps-4 text-sm leading-7 text-[var(--brand-muted)]">درمان از شناخت وضعیت هر فرد آغاز می‌شود؛ برنامهٔ درمان برای زندگی روزمرهٔ او طراحی می‌شود.</p>
      </PublicPageHero>

      <section className="px-4 py-20"><div className="mx-auto max-w-7xl"><Reveal className="max-w-2xl"><p className="brand-overline">پیشینهٔ علمی</p><h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)]">مسیر آموزشی و دانشگاهی</h2></Reveal><Stagger className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-line)] md:grid-cols-3">{education.map((item) => <StaggerItem key={item.degree}><article className="h-full bg-[var(--brand-surface)] p-7"><GraduationCap aria-hidden="true" className="size-6 text-[var(--brand-teal)]" /><h3 className="mt-7 text-lg font-extrabold leading-7 text-[var(--brand-ink)]">{item.degree}</h3><p className="mt-3 leading-7 text-[var(--brand-muted)]">{item.institution}</p></article></StaggerItem>)}</Stagger></div></section>

      <section className="bg-[#123e46] px-4 py-20 text-white"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><Reveal><Quote className="size-9 text-[#b8ded7]" /><p className="mt-5 text-2xl font-bold leading-10">فیزیوتراپیِ مؤثر، با شناخت دقیق مسئله آغاز می‌شود و با آموزش درست بیمار ادامه پیدا می‌کند.</p><p className="mt-5 leading-8 text-white/75">رویکرد کلینیک، تنها به درمان در اتاق فیزیوتراپی محدود نمی‌شود؛ برنامهٔ درمان باید برای زندگی روزمره، خانه و کار بیمار نیز قابل اجرا باشد.</p></Reveal><Stagger className="grid gap-4 sm:grid-cols-2"><StaggerItem><div className="rounded-2xl border border-white/15 bg-white/10 p-6"><BookOpenText className="size-6 text-[#b8ded7]" /><p className="mt-8 text-3xl font-extrabold">بیش از ۱۰۰</p><p className="mt-2 text-white/75">مقاله و فعالیت علمی</p></div></StaggerItem><StaggerItem><div className="rounded-2xl border border-white/15 bg-white/10 p-6"><Landmark className="size-6 text-[#b8ded7]" /><p className="mt-8 text-xl font-extrabold leading-8">دانشگاه علوم پزشکی شهید بهشتی</p><p className="mt-2 text-white/75">فعالیت آموزشی و دانشگاهی</p></div></StaggerItem></Stagger></div></section>

      <section className="px-4 py-20"><div className="mx-auto max-w-4xl"><Reveal><p className="brand-overline">مسیر حرفه‌ای</p><h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)]">چند ایستگاه مهم از یک مسیر مداوم</h2></Reveal><Reveal className="mt-10"><ol className="border-s-2 border-[var(--brand-line)] ps-6 sm:ps-10">{timeline.map((item) => <li key={item.year} className="relative border-b border-[var(--brand-line)] py-6 last:border-b-0"><span className="absolute -start-[calc(1.5rem+6px)] top-8 size-3 rounded-full border-2 border-[var(--brand-page)] bg-[var(--brand-teal)] sm:-start-[calc(2.5rem+6px)]" aria-hidden="true" /><p className="font-extrabold text-[var(--brand-teal)]">{item.year}</p><h3 className="mt-2 text-lg font-extrabold text-[var(--brand-ink)]">{item.title}</h3><p className="mt-2 leading-8 text-[var(--brand-muted)]">{item.detail}</p></li>)}</ol></Reveal><Link href="/clinic" className="brand-link-ring mt-8 inline-flex min-h-12 items-center gap-2 font-bold text-[var(--brand-ink)]">معرفی فضای کلینیک <ArrowLeft aria-hidden="true" className="size-4" /></Link></div></section>
      <Footer />
    </div>
  );
}
