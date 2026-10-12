'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, Expand, Images } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Reveal } from '@/components/motion/Reveal';
import { KineticText } from '@/components/motion/ClinicTextEffects';

interface ClinicGalleryProps {
  images: string[];
  title?: string;
  locale?: 'fa' | 'en';
}

export function ClinicGallery({ images, title, locale = 'fa' }: ClinicGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const en = locale === 'en';
  const imageLabel = (index: number) => en ? `View ${index + 1} of Dr. Rahimi's physiotherapy clinic` : `نمای ${index + 1} از فضای کلینیک فیزیوتراپی دکتر رحیمی`;
  const goTo = (step: number) => setSelectedIndex(current => current === null ? null : (current + step + images.length) % images.length);

  return (
    <section className="brand-soft-section px-4 py-20 sm:py-24" aria-labelledby="clinic-gallery-title" dir={en ? 'ltr' : 'rtl'}>
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="brand-overline flex items-center gap-2"><Images aria-hidden="true" className="size-4" /><KineticText text={en ? 'GALLERY' : 'گالری'} /></div>
            <h2 id="clinic-gallery-title" className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)] sm:text-4xl">{title ?? (en ? 'Explore the clinic' : 'فضای کلینیک')}</h2>
            <p className="mt-4 leading-8 text-[var(--brand-muted)]">{en ? 'A closer look at the clinic and its treatment spaces. Select a photo to explore it.' : 'نگاهی نزدیک به فضای کلینیک و بخش‌های درمان. برای دیدن جزئیات، یکی از تصاویر را انتخاب کنید.'}</p>
          </div>
          <p className="rounded-full border border-[var(--brand-line)] px-4 py-2 text-sm font-semibold text-[var(--brand-muted)]" aria-label={en ? `${images.length} clinic photos` : `${images.length} تصویر از کلینیک`}>{en ? `${images.length} photos` : `${images.length.toLocaleString('fa-IR')} تصویر`}</p>
        </Reveal>
        {images.length > 0 ? <div className="mt-10 grid auto-rows-[11rem] gap-3 sm:grid-cols-2 sm:auto-rows-[12rem] lg:grid-cols-4 lg:auto-rows-[11rem] lg:gap-4">
          {images.map((image, index) => (
            <button key={`${image}-${index}`} type="button" onClick={() => setSelectedIndex(index)} aria-label={en ? `Enlarge clinic photo ${index + 1}` : `نمایش بزرگ‌تر تصویر ${index + 1} از فضای کلینیک`} className={`brand-link-ring group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-soft)] text-start shadow-sm transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-teal)] ${index === 0 ? 'row-span-2 sm:col-span-2 lg:col-span-2' : index % 9 === 5 ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
              <Image src={image} alt={imageLabel(index)} fill sizes={index === 0 ? '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'} className="object-cover transition-transform duration-500 group-hover:scale-[1.045]" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-[#09252b]/85 via-[#09252b]/30 to-transparent px-4 pb-4 pt-16 text-white sm:px-5"><span className="text-sm font-bold tabular-nums" dir="ltr">{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span><span className="inline-flex items-center gap-2 text-sm font-bold">{en ? 'View photo' : 'مشاهده تصویر'}<Expand aria-hidden="true" className="size-4" /></span></span>
            </button>
          ))}
        </div> : <p className="mt-10 rounded-2xl border border-[var(--brand-line)] p-8 text-[var(--brand-muted)]">{en ? 'Clinic photos will appear here soon.' : 'تصاویر کلینیک به‌زودی در این بخش نمایش داده می‌شود.'}</p>}
      </div>
      <Dialog open={selectedIndex !== null} onOpenChange={open => { if (!open) setSelectedIndex(null); }}>
        <DialogContent dir={en ? 'ltr' : 'rtl'} className="max-h-[96dvh] w-[min(96vw,78rem)] max-w-none overflow-y-auto border-[var(--brand-line)] bg-[var(--brand-surface)] p-3 sm:p-5" onKeyDown={event => { if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(en ? -1 : 1); } else if (event.key === 'ArrowRight') { event.preventDefault(); goTo(en ? 1 : -1); } }}>
          <DialogTitle className="pe-8 text-[var(--brand-ink)]">{en ? 'Inside Dr. Rahimi’s physiotherapy clinic' : 'فضای کلینیک فیزیوتراپی دکتر رحیمی'}</DialogTitle>
          <DialogDescription className="sr-only">{en ? 'Enlarged clinic photo. Use the arrow keys or buttons for other photos; press Escape to close.' : 'تصویر بزرگ‌شده از فضای کلینیک. برای دیدن تصاویر دیگر از کلیدهای جهت‌دار یا دکمه‌ها استفاده کنید؛ با Escape ببندید.'}</DialogDescription>
          {selectedIndex !== null && <>
            <div className="relative aspect-[4/3] max-h-[65dvh] w-full overflow-hidden rounded-xl bg-[var(--brand-soft)] sm:aspect-[3/2]"><Image src={images[selectedIndex]} alt={imageLabel(selectedIndex)} fill sizes="(max-width: 1280px) 96vw, 78rem" className="object-contain" /></div>
            <div className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--brand-ink)]">
              <button type="button" onClick={() => goTo(-1)} aria-label={en ? 'Previous clinic photo' : 'تصویر قبلی کلینیک'} className="brand-link-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--brand-line)] px-3 hover:bg-[var(--brand-soft)]"><ArrowLeft aria-hidden="true" className="size-4" />{en ? 'Previous' : 'قبلی'}</button>
              <span aria-live="polite" className="tabular-nums" dir="ltr">{selectedIndex + 1} / {images.length}</span>
              <button type="button" onClick={() => goTo(1)} aria-label={en ? 'Next clinic photo' : 'تصویر بعدی کلینیک'} className="brand-link-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--brand-line)] px-3 hover:bg-[var(--brand-soft)]">{en ? 'Next' : 'بعدی'}<ArrowRight aria-hidden="true" className="size-4" /></button>
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </section>
  );
}
