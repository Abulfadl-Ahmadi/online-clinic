"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand, Images, X } from "lucide-react";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

interface ClinicGalleryProps {
  images: string[];
  title?: string;
  locale?: "fa" | "en";
}

export function ClinicGallery({ images, title, locale = "fa" }: ClinicGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const en = locale === "en";
  const imageLabel = (index: number) => en
    ? `View ${index + 1} of Dr. Rahimi's physiotherapy clinic`
    : `نمای ${index + 1} از فضای کلینیک فیزیوتراپی دکتر رحیمی`;
  const count = (value: number) => en ? String(value) : value.toLocaleString("fa-IR");
  const goTo = (step: number) => setSelectedIndex(current => current === null || images.length === 0
    ? null : (current + step + images.length) % images.length);
  const nearby = selectedIndex === null ? [] : images
    .map((_, index) => index)
    .filter(index => Math.abs(index - selectedIndex) <= 2);

  return (
    <section className="brand-soft-section px-4 py-20 sm:py-24" aria-labelledby="clinic-gallery-title" dir={en ? "ltr" : "rtl"}>
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="brand-overline flex items-center gap-2"><Images aria-hidden="true" className="size-4" />{en ? "Gallery" : "گالری"}</div>
            <h2 id="clinic-gallery-title" className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)] sm:text-4xl">{title ?? (en ? "Explore the clinic" : "فضای کلینیک")}</h2>
            <p className="mt-4 leading-8 text-[var(--brand-muted)]">{en ? "A closer look at the clinic and its treatment spaces. Select a photo to explore it." : "نگاهی نزدیک به فضای کلینیک و بخش‌های درمان. برای دیدن جزئیات، یکی از تصاویر را انتخاب کنید."}</p>
          </div>
          <p className="rounded-full border border-[var(--brand-line)] px-4 py-2 text-sm font-semibold text-[var(--brand-muted)]" aria-label={en ? `${images.length} clinic photos` : `${count(images.length)} تصویر از کلینیک`}>{count(images.length)} {en ? "photos" : "تصویر"}</p>
        </Reveal>
        {images.length > 0 ? <Stagger className="mt-10 grid auto-rows-[11rem] gap-3 sm:grid-cols-2 sm:auto-rows-[12rem] lg:grid-cols-4 lg:auto-rows-[11rem] lg:gap-4" stagger={0.035}>
          {images.map((image, index) => (
            <StaggerItem key={`${image}-${index}`} className={index === 0 ? "row-span-2 sm:col-span-2 lg:col-span-2" : index % 9 === 5 ? "sm:col-span-2 lg:col-span-2" : ""}><button type="button" onClick={() => setSelectedIndex(index)} aria-label={en ? `Enlarge clinic photo ${index + 1}` : `نمایش بزرگ‌تر تصویر ${count(index + 1)} از فضای کلینیک`} className="brand-link-ring group relative block size-full cursor-zoom-in overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-soft)] text-start transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-teal)]">
              <Image src={image} alt={imageLabel(index)} fill sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.045] motion-reduce:transition-none" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-[#09252b]/85 via-[#09252b]/30 to-transparent px-4 pb-4 pt-16 text-white sm:px-5"><span className="text-sm font-bold tabular-nums">{count(index + 1)} / {count(images.length)}</span><span className="inline-flex items-center gap-2 text-sm font-bold">{en ? "View photo" : "مشاهده تصویر"}<Expand aria-hidden="true" className="size-4" /></span></span>
            </button></StaggerItem>
          ))}
        </Stagger> : <p className="mt-10 rounded-2xl border border-[var(--brand-line)] p-8 text-[var(--brand-muted)]">{en ? "Clinic photos will appear here soon." : "تصاویر کلینیک به‌زودی در این بخش نمایش داده می‌شود."}</p>}
      </div>
      <Dialog open={selectedIndex !== null} onOpenChange={open => { if (!open) setSelectedIndex(null); }}>
        <DialogContent
          dir={en ? "ltr" : "rtl"}
          showCloseButton={false}
          overlayClassName="bg-black/85 backdrop-blur-sm"
          className="gallery-viewer flex h-[min(94dvh,56rem)] w-[min(96vw,90rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border p-0 shadow-2xl sm:h-[min(92dvh,62rem)]"
          onKeyDown={event => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              goTo(event.key === "ArrowLeft" ? (en ? -1 : 1) : (en ? 1 : -1));
            }
          }}>
          <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-[var(--brand-line)] px-4 sm:px-6">
            <div className="min-w-0">
              <DialogTitle className="truncate text-base font-bold leading-snug sm:text-lg">{en ? "Inside Dr. Rahimi’s physiotherapy clinic" : "فضای کلینیک فیزیوتراپی دکتر رحیمی"}</DialogTitle>
              <DialogDescription className="sr-only">{en ? "Enlarged clinic photo. Use the arrow keys or buttons for other photos; press Escape to close." : "تصویر بزرگ‌شده از فضای کلینیک. برای دیدن تصاویر دیگر از کلیدهای جهت‌دار یا دکمه‌ها استفاده کنید؛ با Escape ببندید."}</DialogDescription>
            </div>
            <button type="button" onClick={() => setSelectedIndex(null)} aria-label={en ? "Close gallery" : "بستن گالری"} className="brand-link-ring inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--brand-line)] transition-colors hover:bg-[var(--brand-soft)]"><X aria-hidden="true" className="size-5" /></button>
          </header>
          {selectedIndex !== null && <>
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[var(--brand-mist)] px-2 py-3 sm:px-6 sm:py-5"
              onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null; }}
              onTouchEnd={event => {
                const end = event.changedTouches[0]?.clientX;
                if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 60) {
                  goTo(end < touchStart.current ? (en ? 1 : -1) : (en ? -1 : 1));
                }
                touchStart.current = null;
              }}>
              <div className="relative size-full"><Image key={images[selectedIndex]} src={images[selectedIndex]} alt={imageLabel(selectedIndex)} fill sizes="(max-width: 1280px) 96vw, 90rem" className="object-contain" /></div>
            </div>
            <footer className="shrink-0 border-t border-[var(--brand-line)] px-3 py-3 sm:px-6">
              <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                <button type="button" onClick={() => goTo(-1)} aria-label={en ? "Previous clinic photo" : "تصویر قبلی کلینیک"} className="brand-link-ring inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[var(--brand-line)] px-3 transition-colors hover:bg-[var(--brand-soft)]">{en ? <ArrowLeft aria-hidden="true" className="size-4" /> : <ArrowRight aria-hidden="true" className="size-4" />}{en ? "Previous" : "قبلی"}</button>
                <span aria-live="polite" aria-atomic="true" className="tabular-nums">{count(selectedIndex + 1)} / {count(images.length)}</span>
                <button type="button" onClick={() => goTo(1)} aria-label={en ? "Next clinic photo" : "تصویر بعدی کلینیک"} className="brand-link-ring inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[var(--brand-line)] px-3 transition-colors hover:bg-[var(--brand-soft)]">{en ? "Next" : "بعدی"}{en ? <ArrowRight aria-hidden="true" className="size-4" /> : <ArrowLeft aria-hidden="true" className="size-4" />}</button>
              </div>
              {images.length > 1 && <div className="mt-3 hidden items-center justify-center gap-2 sm:flex" aria-label={en ? "Nearby photos" : "تصاویر نزدیک"}>
                {nearby.map(index => <button key={index} type="button" aria-label={en ? `Show photo ${index + 1}` : `نمایش تصویر ${count(index + 1)}`} aria-current={index === selectedIndex ? "true" : undefined} onClick={() => setSelectedIndex(index)} className={`brand-link-ring relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-[opacity,border-color] ${index === selectedIndex ? "border-[var(--brand-teal)]" : "border-transparent opacity-60 hover:opacity-100"}`}><Image src={images[index]} alt="" fill sizes="48px" className="object-cover" /></button>)}
              </div>}
            </footer>
          </>}
        </DialogContent>
      </Dialog>
    </section>
  );
}
