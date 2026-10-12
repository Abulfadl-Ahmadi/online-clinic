import Image from "next/image";
import { CheckCircle2, Clock3, MapPin, TrainFront } from "lucide-react";

import { ClinicGallery } from "@/components/clinic/ClinicGallery";
import { PublicPageHero } from "@/components/clinic/PublicPageHero";
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
      <PublicPageHero eyebrow="دربارهٔ کلینیک" title="فضایی برای حرکت دوباره" description="در کلینیک فیزیوتراپی دکتر رحیمی در شرق تهران، درمان از ارزیابی دقیق آغاز می‌شود و با برنامه‌ای متناسب با نیاز هر مراجعه‌کننده ادامه پیدا می‌کند." image="/images/brand/movement-assessment.png" imageAlt="ارزیابی حرکت و تعادل در فضای فیزیوتراپی" caption="فضای ارزیابی و توان‌بخشی در مرکز فیزیوتراپی دکتر رحیمی">
        <div className="mt-6 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--brand-line)] bg-[var(--brand-line)]"><div className="bg-[var(--brand-surface)] p-4"><p className="text-xl font-extrabold text-[var(--brand-ink)]">۱۶۰ مترمربع</p><p className="mt-1 text-sm text-[var(--brand-muted)]">فضای تخصصی مرکز</p></div><div className="bg-[var(--brand-surface)] p-4"><p className="text-xl font-extrabold text-[var(--brand-ink)]">خیابان پیروزی</p><p className="mt-1 text-sm text-[var(--brand-muted)]">دسترسی در شرق تهران</p></div></div>
      </PublicPageHero>

      <section className="px-4 py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--brand-soft)]"><Image src="/images/general/clinic/photo_2025-12-17_03-27-09.jpg" alt="پذیرش کلینیک فیزیوتراپی دکتر رحیمی" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" /></Reveal><div><Reveal><p className="brand-overline">آنچه در کلینیک تجربه می‌کنید</p><h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--brand-ink)]">درمان با برنامه، نه صرفاً یک جلسه درمان</h2></Reveal><Stagger className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-line)] sm:grid-cols-2">{features.map((feature) => <StaggerItem key={feature} className="bg-[var(--brand-surface)]"><div className="flex h-full items-start gap-3 p-5 leading-8 text-[var(--brand-copy)]"><CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0 text-[var(--brand-teal)]" />{feature}</div></StaggerItem>)}</Stagger></div></div></section>

      <CareOptions />
      <InsuranceLogoCloud />
      <ClinicGallery images={clinicImages} title="فضای کلینیک" />

      <section className="px-4 py-20" aria-labelledby="visit-title"><div className="mx-auto max-w-7xl"><Reveal className="mb-8"><p className="brand-overline">برنامه‌ریزی مراجعه</p><h2 id="visit-title" className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)]">پیش از آمدن به کلینیک</h2></Reveal><Reveal className="public-info-strip grid overflow-hidden rounded-2xl border border-[var(--brand-line)] sm:grid-cols-3"><div className="p-7"><MapPin aria-hidden="true" className="size-6 text-[var(--brand-teal)]" /><h3 className="mt-6 text-xl font-extrabold text-[var(--brand-ink)]">آدرس</h3><p className="mt-3 leading-8 text-[var(--brand-copy)]">تهران، خیابان پیروزی، بین خیابان سوم و چهارم نیروی هوایی، پلاک ۱۲۵، ساختمان پزشکان ادیب، مرکز فیزیوتراپی دکتر رحیمی.</p></div><div className="p-7"><Clock3 aria-hidden="true" className="size-6 text-[var(--brand-teal)]" /><h3 className="mt-6 text-xl font-extrabold text-[var(--brand-ink)]">ساعت مراجعه</h3><p className="mt-3 leading-8 text-[var(--brand-copy)]">شنبه تا چهارشنبه: ۸ تا ۱۲ و ۱۵ تا ۲۰<br />پنجشنبه: ۸ تا ۱۲</p></div><div className="p-7"><TrainFront aria-hidden="true" className="size-6 text-[var(--brand-teal)]" /><h3 className="mt-6 text-xl font-extrabold text-[var(--brand-ink)]">دسترسی</h3><p className="mt-3 leading-8 text-[var(--brand-copy)]">ایستگاه متروی نیروی هوایی در فاصلهٔ حدود ۱۵۰ متری کلینیک قرار دارد. امکان پارک در خیابان و کوچه‌های اطراف نیز معمولاً فراهم است.</p></div></Reveal><a href="tel:02177402528" className="brand-link-ring mt-8 inline-flex min-h-12 items-center rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-6 font-bold text-[var(--brand-ink)]">هماهنگی تلفنی پیش از مراجعه</a></div></section>
      <Footer />
    </div>
  );
}
