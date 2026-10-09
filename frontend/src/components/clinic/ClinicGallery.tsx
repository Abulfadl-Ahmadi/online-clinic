'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

interface ClinicGalleryProps {
  images: string[];
  title?: string;
  locale?: 'fa' | 'en';
}

export function ClinicGallery({ images, title, locale = 'fa' }: ClinicGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const en = locale === 'en';

  return (
    <section className="brand-soft-section px-4 py-20 sm:py-24" aria-labelledby="clinic-gallery-title">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="brand-overline">{en ? 'INSIDE THE CLINIC' : 'نگاهی به فضای درمان'}</p>
          <h2 id="clinic-gallery-title" className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)] sm:text-4xl">{title ?? (en ? 'Explore the clinic' : 'فضای کلینیک')}</h2>
          <p className="mt-4 leading-8 text-[var(--brand-muted)]">{en ? 'Take a closer look at our treatment spaces. Select an image to enlarge it.' : 'تصاویر بخش‌های مختلف کلینیک را ببینید. برای نمایش بزرگ‌تر، روی هر تصویر بزنید.'}</p>
        </Reveal>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
          {images.map((image, index) => (
            <StaggerItem key={image}>
              <button type="button" onClick={() => setSelectedIndex(index)} aria-label={en ? `Enlarge clinic photo ${index + 1}` : `نمایش بزرگ‌تر تصویر ${index + 1} از فضای کلینیک`} className="brand-link-ring group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-soft)] text-start">
                <Image src={image} alt={en ? `View ${index + 1} of Dr. Rahimi's physiotherapy clinic` : `نمای ${index + 1} از فضای کلینیک فیزیوتراپی دکتر رحیمی`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                <span className="absolute bottom-3 end-3 rounded-lg bg-[#123e46]/90 px-3 py-2 text-sm font-bold text-white">{en ? 'Enlarge' : 'نمایش بزرگ‌تر'}</span>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      <Dialog open={selectedIndex !== null} onOpenChange={open => { if (!open) setSelectedIndex(null); }}>
        <DialogContent dir={en ? 'ltr' : 'rtl'} className="w-[min(95vw,72rem)] max-w-none border-[var(--brand-line)] bg-[var(--brand-surface)] p-3 sm:p-5">
          <DialogTitle className="pe-8 text-[var(--brand-ink)]">{en ? 'Inside Dr. Rahimi’s physiotherapy clinic' : 'فضای کلینیک فیزیوتراپی دکتر رحیمی'}</DialogTitle>
          <DialogDescription className="sr-only">{en ? 'Enlarged clinic photo. Press Escape or the close button to return to the gallery.' : 'تصویر بزرگ‌شده از فضای کلینیک. با کلید Escape یا دکمه بستن به گالری بازگردید.'}</DialogDescription>
          {selectedIndex !== null && <div className="relative aspect-[4/3] max-h-[75vh] w-full overflow-hidden rounded-xl bg-[var(--brand-soft)] sm:aspect-[3/2]">
            <Image src={images[selectedIndex]} alt={en ? `View ${selectedIndex + 1} of Dr. Rahimi's physiotherapy clinic` : `نمای ${selectedIndex + 1} از فضای کلینیک فیزیوتراپی دکتر رحیمی`} fill sizes="95vw" className="object-contain" />
          </div>}
        </DialogContent>
      </Dialog>
    </section>
  );
}
