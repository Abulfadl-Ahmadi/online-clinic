import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

/** Shared editorial entry point for the clinic's public pages. */
export function PublicPageHero({ eyebrow, title, description, image, imageAlt, caption, children }: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  caption: string;
  children?: ReactNode;
}) {
  return <section className="public-intro relative isolate overflow-hidden px-4 pb-16 pt-14 sm:pb-20 sm:pt-20">
    <div className="public-intro-pattern pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
    <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,.96fr)] lg:gap-14">
      <Reveal className="order-2 lg:order-1">
        <p className="text-sm font-bold text-[var(--brand-teal)]">{eyebrow}</p>
        <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-[var(--brand-copy)] sm:text-lg">{description}</p>
        {children}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/auth/login" className="brand-link-ring hero-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-bold"><CalendarDays aria-hidden="true" className="size-5" />درخواست نوبت<ArrowLeft aria-hidden="true" className="size-4" /></Link>
          <a href="tel:02177402528" className="brand-link-ring hero-secondary inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-bold"><Phone aria-hidden="true" className="size-5" />تماس با کلینیک</a>
        </div>
      </Reveal>
      <Reveal delay={0.08} className="order-1 lg:order-2"><figure>
        <div className="public-intro-image relative aspect-[1.55] overflow-hidden rounded-2xl bg-[var(--brand-soft)] sm:aspect-[1.35] lg:aspect-[1.1]"><Image src={image} alt={imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover object-[62%_center]" /></div>
        <figcaption className="mt-4 border-s-2 border-[var(--brand-teal)] ps-4 text-sm leading-7 text-[var(--brand-muted)]">{caption}</figcaption>
      </figure></Reveal>
    </div>
  </section>;
}
