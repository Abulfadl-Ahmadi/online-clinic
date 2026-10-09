import Image from "next/image";
import Link from "next/link";
import { BookOpenText, CalendarDays, GraduationCap, Landmark } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const education = [
  ["BSc in Physiotherapy", "Shiraz University of Medical Sciences"],
  ["MSc in Physiotherapy", "Tehran University of Medical Sciences"],
  ["PhD in Physiotherapy (Sports Injury Rehabilitation)", "University of Nottingham, United Kingdom · 2001"],
];

export const metadata = { title: "About Dr. Rahimi", alternates: { languages: { fa: "/about-us", en: "/en/about" } } };

export default function EnglishAboutPage() {
  return <>
    <section className="brand-motion-field px-4 py-16 sm:py-20"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
      <Reveal><p className="brand-overline">DR. ABBAS RAHIMI</p><h1 className="mt-4 text-4xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-5xl">Research, teaching and hands-on physiotherapy</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--brand-copy)]">Dr. Abbas Rahimi is a physiotherapist and a full professor at the School of Rehabilitation, Shahid Beheshti University of Medical Sciences. His clinical work is informed by his experience in teaching and research.</p><Link href="/auth/login" className="brand-link-ring mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#123e46] px-5 font-bold text-white hover:bg-[#0d3239]"><CalendarDays className="size-5" />Book (Persian portal)</Link></Reveal>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[var(--brand-soft)] shadow-xl"><Image src="/images/brand/dr-abbas-rahimi-hero.png" alt="Dr. Abbas Rahimi at the clinic" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
    </div></section>
    <section className="px-4 py-20"><div className="mx-auto max-w-7xl"><Reveal><p className="brand-overline">EDUCATION</p><h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)]">From physiotherapy training to specialist research</h2></Reveal><Stagger className="mt-10 grid gap-4 md:grid-cols-3">{education.map(([degree, institution]) => <StaggerItem key={degree}><article className="brand-card h-full rounded-2xl p-7"><GraduationCap aria-hidden="true" className="size-6 text-[var(--brand-teal)]" /><h3 className="mt-7 text-lg font-extrabold leading-7 text-[var(--brand-ink)]">{degree}</h3><p className="mt-3 leading-7 text-[var(--brand-muted)]">{institution}</p></article></StaggerItem>)}</Stagger></div></section>
    <section className="bg-[#123e46] px-4 py-20 text-white"><div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2"><article className="rounded-2xl border border-white/15 bg-white/10 p-7"><BookOpenText className="size-6 text-[#b8ded7]" /><h2 className="mt-6 text-xl font-extrabold">Academic work</h2><p className="mt-3 leading-8 text-white/75">He has published more than 100 scientific papers and presented at national and international academic events.</p></article><article className="rounded-2xl border border-white/15 bg-white/10 p-7"><Landmark className="size-6 text-[#b8ded7]" /><h2 className="mt-6 text-xl font-extrabold">Clinical practice</h2><p className="mt-3 leading-8 text-white/75">Alongside university teaching, he has worked as a physiotherapist in clinics and hospitals in Tehran. His clinic is located on Pirouzi Street.</p></article></div></section>
    <section className="px-4 py-20"><Reveal className="brand-card mx-auto max-w-7xl rounded-2xl p-8 sm:p-12"><p className="brand-overline">PERSON-CENTRED CARE</p><h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)]">A plan built around your assessment</h2><p className="mt-5 max-w-3xl leading-8 text-[var(--brand-muted)]">The clinic reviews health history, precautions and movement before planning treatment. Exercises and practical guidance for home and work are part of the approach, alongside communication with the referring physician.</p><Link href="/en/clinic" className="brand-link-ring mt-6 inline-flex min-h-11 items-center font-bold text-[var(--brand-ink)] hover:text-[var(--brand-wine)]">Learn about the clinic →</Link></Reveal></section>
  </>;
}
