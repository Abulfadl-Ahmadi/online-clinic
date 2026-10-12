import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Phone, TrainFront } from "lucide-react";

import { ClinicGallery } from "@/components/clinic/ClinicGallery";
import { CareOptions } from "@/components/clinic/CareOptions";
import { InsuranceLogoCloud } from "@/components/clinic/InsuranceLogoCloud";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Footer } from "@/components/layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const clinicImages = [
  '/images/general/clinic/photo_2025-12-17_03-25-39.jpg', '/images/general/clinic/photo_2025-12-17_03-25-47.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-03.jpg', '/images/general/clinic/photo_2025-12-17_03-26-07.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-13.jpg', '/images/general/clinic/photo_2025-12-17_03-26-17.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-22.jpg', '/images/general/clinic/photo_2025-12-17_03-26-27.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-31.jpg', '/images/general/clinic/photo_2025-12-17_03-26-39.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-47.jpg', '/images/general/clinic/photo_2025-12-17_03-26-50.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-51.jpg', '/images/general/clinic/photo_2025-12-17_03-26-53.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-54.jpg', '/images/general/clinic/photo_2025-12-17_03-26-55.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-56.jpg', '/images/general/clinic/photo_2025-12-17_03-26-59.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-02.jpg', '/images/general/clinic/photo_2025-12-17_03-27-05.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-07.jpg', '/images/general/clinic/photo_2025-12-17_03-27-09.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-11.jpg', '/images/general/clinic/photo_2025-12-17_03-27-13.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-20.jpg',
];

const features = [
  'فضای ۱۶۰ مترمربعی با اتاق‌های درمان و تجهیزات تخصصی',
  'رویکرد توان‌بخشی مبتنی بر شواهد و ارزیابی دقیق بیمار',
  'استفاده از الکتروتراپی، لیزر کم‌توان و پرتوان، شاک‌ویو، تکار، مگنت، APS، وازوترین، درای‌نیدلینگ، درمان دستی و تمرین‌درمانی بر اساس نیاز درمانی',
  'همکاری و ارتباط مستمر با پزشکان معالج و آموزش تمرین‌های خانگی',
];

export default function ClinicPage() {
  return (
    <div className="brand-page min-h-screen" dir="rtl">
      <ScrollProgress />
      <section className="brand-motion-field px-4 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="brand-overline">دربارهٔ کلینیک</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#123e46] sm:text-5xl">یک فضای تخصصی برای بازگشت آگاهانه به حرکت</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#415357]">کلینیک فیزیوتراپی دکتر رحیمی در شرق تهران با تیم حرفه‌ای، دانش روز و تجهیزات درمانی، به مراجعان در حوزه‌های مختلف توان‌بخشی خدمات ارائه می‌دهد.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/auth/login" className="brand-link-ring inline-flex h-11 items-center gap-2 rounded-xl bg-[#123e46] px-5 font-bold text-white hover:bg-[#0d3239]"><CalendarDays className="size-5" />درخواست نوبت</Link><a href="tel:02177402528" className="brand-link-ring inline-flex h-11 items-center gap-2 rounded-xl border border-[#123e46]/15 bg-white px-5 font-bold text-[#123e46]"><Phone className="size-5" />تماس با کلینیک</a></div>
          </Reveal>
          <Reveal delay={0.1} className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-xl shadow-[#123e46]/10"><Image src="/images/brand/movement-assessment.png" alt="ارزیابی حرکت و تعادل در فضای فیزیوتراپی" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></Reveal>
        </div>
      </section>

      <section className="px-4 py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><Reveal className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]"><Image src="/images/general/clinic/photo_2025-12-17_03-27-09.jpg" alt="پذیرش کلینیک فیزیوتراپی دکتر رحیمی" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" /></Reveal><Reveal delay={0.08}><p className="brand-overline">آنچه در کلینیک تجربه می‌کنید</p><h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#123e46]">درمان با برنامه، نه صرفاً یک جلسه درمان</h2><Stagger className="mt-7 space-y-4">{features.map((feature) => <StaggerItem key={feature}><div className="flex items-start gap-3 leading-7 text-[#526468]"><CheckCircle2 className="mt-1 size-5 shrink-0 text-[#4b8a83]" />{feature}</div></StaggerItem>)}</Stagger></Reveal></div></section>

      <CareOptions />
      <InsuranceLogoCloud />
      <ClinicGallery images={clinicImages} title="فضای کلینیک" />

      <section className="px-4 py-20"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#123e46] text-white md:grid-cols-3"><div className="p-8 sm:p-10"><MapPin className="size-6 text-[#b8ded7]" /><h2 className="mt-6 text-xl font-extrabold">آدرس</h2><p className="mt-3 leading-8 text-white/75">تهران، خیابان پیروزی، بین خیابان سوم و چهارم نیروی هوایی، پلاک ۱۲۵، ساختمان پزشکان ادیب، مرکز فیزیوتراپی دکتر رحیمی.</p></div><div className="border-y border-white/15 p-8 sm:p-10 md:border-x md:border-y-0"><Clock3 className="size-6 text-[#b8ded7]" /><h2 className="mt-6 text-xl font-extrabold">ساعت مراجعه</h2><p className="mt-3 leading-8 text-white/75">شنبه تا چهارشنبه: ۸ تا ۱۲ و ۱۵ تا ۲۰<br />پنجشنبه: ۸ تا ۱۲</p></div><div className="p-8 sm:p-10"><TrainFront className="size-6 text-[#b8ded7]" /><h2 className="mt-6 text-xl font-extrabold">دسترسی</h2><p className="mt-3 leading-8 text-white/75">ایستگاه متروی نیروی هوایی در فاصلهٔ حدود ۱۵۰ متری کلینیک قرار دارد. امکان پارک در خیابان و کوچه‌های اطراف نیز معمولاً فراهم است.</p></div></div></section>
      <Footer />
    </div>
  );
}
