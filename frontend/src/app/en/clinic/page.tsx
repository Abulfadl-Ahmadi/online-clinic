import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, MapPin, TrainFront } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { InsuranceLogoCloud } from "@/components/clinic/InsuranceLogoCloud";
import { ClinicGallery } from "@/components/clinic/ClinicGallery";

const images = [
  "photo_2025-12-17_03-25-39.jpg", "photo_2025-12-17_03-26-03.jpg",
  "photo_2025-12-17_03-26-13.jpg", "photo_2025-12-17_03-26-31.jpg",
  "photo_2025-12-17_03-26-47.jpg", "photo_2025-12-17_03-27-02.jpg",
].map((file) => `/images/general/clinic/${file}`);

const features = [
  "160 m² of clinical space with treatment rooms and rehabilitation equipment",
  "Individual assessment and a treatment plan informed by current evidence",
  "Electrotherapy, laser, shockwave, TECAR, magnetotherapy, dry needling, manual therapy, biofeedback and therapeutic exercise when appropriate",
  "Communication with treating physicians and guidance for exercise at home",
];

const pathway = [
  { title: "Initial conversation", text: "We review your referral, health history and treatment goals." },
  { title: "Movement assessment", text: "A physiotherapist considers safety precautions, walking and movement, and the nature of your condition." },
  { title: "A plan beyond the clinic", text: "Your plan covers treatment visits as well as precautions and exercises at home or work." },
];

export const metadata = { title: "The Clinic", alternates: { languages: { fa: "/clinic", en: "/en/clinic" } } };

export default function EnglishClinicPage() {
  return <>
    <section className="brand-motion-field px-4 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <Reveal><p className="brand-overline">THE CLINIC</p><h1 className="mt-4 text-4xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-5xl">A considered path back to movement</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--brand-copy)]">In Pirouzi, east Tehran, Dr. Rahimi’s clinic combines careful assessment with an individual approach to rehabilitation.</p><Link href="/auth/login" className="brand-link-ring mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#123e46] px-5 font-bold text-white hover:bg-[#0d3239]"><CalendarDays className="size-5" />Book (Persian portal)</Link></Reveal>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[var(--brand-soft)] shadow-xl"><Image src="/images/brand/movement-assessment.png" alt="Physiotherapy movement assessment" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
      </div>
    </section>
    <section className="px-4 py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]"><Image src="/images/general/clinic/photo_2025-12-17_03-27-09.jpg" alt="Reception area at the clinic" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" /></div>
      <Reveal><p className="brand-overline">WHAT TO EXPECT</p><h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)]">A treatment plan, not just a session</h2><ul className="mt-7 space-y-4">{features.map((feature) => <li key={feature} className="flex gap-3 leading-7 text-[var(--brand-copy)]"><CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0 text-[var(--brand-teal)]" />{feature}</li>)}</ul></Reveal>
    </div></section>
    <section className="px-4 py-20"><div className="mx-auto max-w-7xl"><Reveal><p className="brand-overline">YOUR VISIT</p><h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-ink)]">From assessment to a plan you can use</h2></Reveal><Stagger className="mt-9 grid gap-4 md:grid-cols-3">{pathway.map((step) => <StaggerItem key={step.title}><article className="brand-card h-full rounded-2xl p-7"><h3 className="text-xl font-bold text-[var(--brand-ink)]">{step.title}</h3><p className="mt-3 leading-7 text-[var(--brand-muted)]">{step.text}</p></article></StaggerItem>)}</Stagger></div></section>
    <section className="px-4 pb-20"><Reveal className="brand-card mx-auto max-w-7xl rounded-2xl p-7 sm:p-10"><h2 className="text-2xl font-extrabold text-[var(--brand-ink)]">Care for different needs</h2><p className="mt-3 max-w-4xl leading-8 text-[var(--brand-muted)]">The clinic supports musculoskeletal and sports injuries, neurological and rheumatological conditions, children, women’s health and pelvic-floor rehabilitation. A physiotherapist may use foot scanning and analysis of the spine and limbs to assess deformities and inform treatment; please call to confirm assessment times.</p></Reveal></section>
    <InsuranceLogoCloud locale="en" />
    <ClinicGallery images={images} locale="en" title="Explore the clinic" />
    <section className="px-4 py-20"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#123e46] text-white md:grid-cols-3"><div className="p-8 sm:p-10"><MapPin className="size-6 text-[#b8ded7]" /><h2 className="mt-6 text-xl font-extrabold">Address</h2><p className="mt-3 leading-8 text-white/75">No. 125, Adib Medical Building, between 3rd and 4th Neyrou Havaei St., Pirouzi St., Tehran — Dr. Rahimi Physiotherapy Centre.</p></div><div className="border-y border-white/15 p-8 sm:p-10 md:border-x md:border-y-0"><Clock3 className="size-6 text-[#b8ded7]" /><h2 className="mt-6 text-xl font-extrabold">Hours</h2><p className="mt-3 leading-8 text-white/75">Saturday–Wednesday: 8–12 and 15–20<br />Thursday: 8–12</p></div><div className="p-8 sm:p-10"><TrainFront className="size-6 text-[#b8ded7]" /><h2 className="mt-6 text-xl font-extrabold">Getting here</h2><p className="mt-3 leading-8 text-white/75">Neyrou Havaei Metro Station is approximately 150 metres away. Street parking and a nearby public car park may be available.</p></div></div></section>
  </>;
}
