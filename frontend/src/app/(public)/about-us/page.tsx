import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpenText, CalendarDays, GraduationCap, Landmark, Phone, Quote } from "lucide-react";

import { Footer } from "@/components/layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

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
      <section className="brand-motion-field px-4 py-16 sm:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center"><div className="order-2 lg:order-1"><p className="brand-overline">دربارهٔ دکتر عباس رحیمی</p><h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#123e46] sm:text-5xl">دانش دانشگاهی، تجربهٔ بالینی و توجه به مسیر هر بیمار</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#415357]">دکتر عباس رحیمی، فیزیوتراپیست و استاد تمام دانشکدهٔ توان‌بخشی دانشگاه علوم پزشکی شهید بهشتی، بیش از دو دهه است که در آموزش، پژوهش و درمان بیماران فعالیت می‌کند.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/auth/login" className="brand-link-ring inline-flex h-11 items-center gap-2 rounded-xl bg-[#123e46] px-5 font-bold text-white hover:bg-[#0d3239]"><CalendarDays className="size-5" />درخواست نوبت</Link><a href="tel:02177402528" className="brand-link-ring inline-flex h-11 items-center gap-2 rounded-xl border border-[#123e46]/15 bg-white px-5 font-bold text-[#123e46]"><Phone className="size-5" />تماس با کلینیک</a></div></div><div className="relative order-1 aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#dceae7] shadow-xl shadow-[#123e46]/10 lg:order-2"><Image src="/images/brand/dr-abbas-rahimi-hero.png" alt="دکتر عباس رحیمی" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div></div></section>

      <section className="px-4 py-20"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="brand-overline">پیشینهٔ علمی</p><h2 className="mt-3 text-3xl font-extrabold text-[#123e46]">مسیر آموزشی و دانشگاهی</h2></div><Stagger className="mt-10 grid gap-4 md:grid-cols-3">{education.map((item) => <StaggerItem key={item.degree}><article className="rounded-2xl border border-[#123e46]/10 bg-white p-6"><GraduationCap className="size-6 text-[#4b8a83]" /><h3 className="mt-7 text-lg font-extrabold leading-7 text-[#123e46]">{item.degree}</h3><p className="mt-3 leading-7 text-[#596a6d]">{item.institution}</p></article></StaggerItem>)}</Stagger></div></section>

      <section className="bg-[#123e46] px-4 py-20 text-white"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><Quote className="size-9 text-[#b8ded7]" /><p className="mt-5 text-2xl font-bold leading-10">فیزیوتراپیِ مؤثر، با شناخت دقیق مسئله آغاز می‌شود و با آموزش درست بیمار ادامه پیدا می‌کند.</p><p className="mt-5 leading-8 text-white/75">رویکرد کلینیک، تنها به درمان در اتاق فیزیوتراپی محدود نمی‌شود؛ برنامهٔ درمان باید برای زندگی روزمره، خانه و کار بیمار نیز قابل اجرا باشد.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/15 bg-white/10 p-6"><BookOpenText className="size-6 text-[#b8ded7]" /><p className="mt-8 text-3xl font-extrabold">بیش از ۱۰۰</p><p className="mt-2 text-white/75">مقاله و فعالیت علمی</p></div><div className="rounded-2xl border border-white/15 bg-white/10 p-6"><Landmark className="size-6 text-[#b8ded7]" /><p className="mt-8 text-xl font-extrabold leading-8">دانشگاه علوم پزشکی شهید بهشتی</p><p className="mt-2 text-white/75">فعالیت آموزشی و دانشگاهی</p></div></div></div></section>

      <section className="px-4 py-20"><div className="mx-auto max-w-4xl"><div className="text-center"><p className="brand-overline">مسیر حرفه‌ای</p><h2 className="mt-3 text-3xl font-extrabold text-[#123e46]">چند ایستگاه مهم از یک مسیر مداوم</h2></div><div className="mt-12 flex flex-col gap-5">{timeline.map((item) => <Reveal key={item.year}><article className="grid gap-4 rounded-2xl border border-[#123e46]/10 bg-white p-6 sm:grid-cols-[7rem_1fr] sm:items-start"><p className="text-xl font-extrabold text-[#74364b]">{item.year}</p><div><h3 className="text-lg font-extrabold text-[#123e46]">{item.title}</h3><p className="mt-2 leading-7 text-[#596a6d]">{item.detail}</p></div></article></Reveal>)}</div><div className="mt-10 text-center"><Link href="/clinic" className="brand-link-ring inline-flex items-center gap-2 font-bold text-[#123e46] hover:text-[#74364b]">معرفی فضای کلینیک <ArrowLeft className="size-4" /></Link></div></div></section>
      <Footer />
    </div>
  );
}
