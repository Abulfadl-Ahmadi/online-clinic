import Image from "next/image";
import Link from "next/link";
import {
	Activity,
	ArrowLeft,
	Brain,
	CalendarDays,
	ChevronLeft,
	Clock3,
	Footprints,
	MapPin,
	Phone,
	ScanLine,
	ShieldCheck,
	Stethoscope,
	Trophy,
} from "lucide-react";

import { ClinicFaq } from "@/components/clinic/ClinicFaq";
import { CareOptions } from "@/components/clinic/CareOptions";
import { InsuranceLogoCloud } from "@/components/clinic/InsuranceLogoCloud";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { BlurText } from "@/components/motion/BlurText";
import { FeaturesBlock } from "@/components/blocks/features";
import { StatsBlock } from "@/components/blocks/stats";
import { BentoGrid } from "@/components/blocks/bento";
import { Footer } from "@/components/layout";

const clinicFacts = [
	{ value: "۱۶۰ متر", label: "فضای تخصصی درمان" },
	{ value: "۱۵۰ متر", label: "فاصله تا متروی نیروی هوایی", hint: "حدودی؛ پیش از مراجعه مسیر را بررسی کنید" },
	{ value: "۵ روز", label: "ساعت کاری کامل در هفته", hint: "شنبه تا چهارشنبه؛ پنجشنبه نیم‌روز" },
	{ value: "شرق تهران", label: "نشانی مرکز", hint: "خیابان پیروزی" },
];

const services = [
	{ icon: Activity, title: "دردهای اسکلتی‌عضلانی", description: "ارزیابی و درمان مشکلات کمر، گردن، شانه، زانو و سایر مفاصل." },
	{ icon: Trophy, title: "آسیب‌های ورزشی", description: "توان‌بخشی هدفمند پس از آسیب‌های ورزشی، از جمله ACL و منیسک." },
	{ icon: Brain, title: "توان‌بخشی نورولوژیک", description: "کمک به بازیابی حرکت و استقلال پس از سکته، پارکینسون و آسیب‌های عصبی." },
	{ icon: Stethoscope, title: "توان‌بخشی پس از جراحی", description: "برنامهٔ درمانی مرحله‌به‌مرحله پس از جراحی‌های ارتوپدی و مغز و اعصاب." },
	{ icon: Footprints, title: "حرکات اصلاحی و تعادل", description: "آموزش حرکت، پیشگیری از آسیب و بهبود تعادل برای کودکان، بزرگسالان و سالمندان." },
	{ icon: ScanLine, title: "ارزیابی حرکت و کف پا", description: "ارزیابی ستون فقرات، اندام تحتانی و اسکن کف پا برای تصمیم‌گیری دقیق‌تر." },
	{ icon: ShieldCheck, title: "توان‌بخشی زنان و کف لگن", description: "ارزیابی و فیزیوتراپی اختلالات کف لگن با روش‌هایی مانند بیوفیدبک، بر اساس نیاز هر فرد." },
	{ icon: Footprints, title: "کودکان و سالمندان", description: "ارزیابی وضعیت بدنی کودکان و کمک به تعادل، راه‌رفتن ایمن و حرکت سالمندان." },
	{ icon: Activity, title: "بیماری‌های روماتیسمی", description: "برنامهٔ توان‌بخشی متناسب با مشکلات مفصلی و محدودیت حرکت در بیماری‌های روماتیسمی." },
];

const treatmentPath = [
	{ step: "۰۱", title: "گفت‌وگو و ارزیابی", description: "ثبت بیماری‌های زمینه‌ای، غربالگری علائم هشدار و احتیاط، بررسی وضعیت قلبی‌ریوی، راه‌رفتن و حرکت پیش از شروع درمان." },
	{ step: "۰۲", title: "برنامهٔ درمان شخصی", description: "تعیین درمان داخل کلینیک، تمرین‌های مناسب و نکته‌هایی که باید در خانه و محل کار رعایت کنید." },
	{ step: "۰۳", title: "تمرین و پیگیری", description: "تمرین درست در مرکز و تکرار ایمن آن در منزل؛ همکاری با پزشک معالج و پیگیری روند درمان." },
];

const clinicPhotos = [
	"/images/general/clinic/photo_2025-12-17_03-27-09.jpg",
	"/images/general/clinic/photo_2025-12-17_03-26-17.jpg",
	"/images/general/clinic/photo_2025-12-17_03-27-20.jpg",
];

export default function HomePage() {
	return (
		<div className="brand-page min-h-screen" dir="rtl">
			<ScrollProgress />
			<section className="hero-stage relative isolate overflow-hidden px-4 pb-20 pt-12 sm:pb-24 sm:pt-20" aria-labelledby="home-hero-title">
				<div className="hero-stage-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
				<div className="hero-stage-glow pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
				<div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-12">
					<div className="order-2 lg:order-1">
						<Reveal><p className="hero-eyebrow mb-5 inline-flex items-center gap-3 text-sm font-bold text-[var(--brand-teal)]"><span className="hero-eyebrow-mark" aria-hidden="true" />مرکز فیزیوتراپی دکتر رحیمی</p></Reveal>
						<h1 id="home-hero-title" className="hero-title text-[var(--brand-ink)]">
							<span className="block text-[.52em] font-bold leading-snug text-[var(--brand-copy)]">فیزیوتراپی با</span>
							<span className="block"><BlurText text="دکتر عباس رحیمی" /></span>
						</h1>
						<Reveal delay={0.12}><p className="hero-statement mt-6 text-xl font-bold leading-relaxed text-[var(--brand-ink)] sm:text-2xl">بازگشت به حرکت، با پشتوانهٔ علم.</p>
						<p className="mt-4 max-w-xl text-base leading-8 text-[var(--brand-copy)] sm:text-lg">از ارزیابی دقیق تا برنامهٔ درمانی شخصی، در کنار شما هستیم تا با توان‌بخشی مبتنی بر شواهد، با اطمینان بیشتری به حرکت بازگردید.</p></Reveal>
						<Reveal delay={0.18}><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
							<Link href="/auth/login" className="brand-link-ring hero-primary inline-flex min-h-12 items-center justify-center gap-3 rounded-xl px-6 font-bold"><CalendarDays className="size-5" />درخواست نوبت آنلاین<ArrowLeft className="size-4" /></Link>
							<a href="tel:02177402528" className="brand-link-ring hero-secondary inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-bold"><Phone className="size-5" />تماس با کلینیک</a>
						</div></Reveal>
					</div>
					<Reveal delay={0.1} className="relative order-1 mx-auto w-full max-w-xl lg:order-2 lg:max-w-none">
						<div className="hero-photo-accent pointer-events-none absolute -inset-3 rounded-[2rem]" aria-hidden="true" />
						<div className="hero-photo relative aspect-[1.54] overflow-hidden rounded-[1.65rem] bg-[var(--brand-soft)] sm:aspect-[1.38] lg:aspect-[1.08]"><Image src="/images/brand/dr-abbas-rahimi-hero.png" alt="دکتر عباس رحیمی در فضای توان‌بخشی کلینیک" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[62%_center] sm:object-[65%_center] lg:object-[61%_center]" /></div>
						<p className="hero-photo-caption mt-4 text-sm font-semibold leading-6 text-[var(--brand-muted)]">دکتر عباس رحیمی <span aria-hidden="true">/</span> استاد تمام دانشگاه علوم پزشکی شهید بهشتی</p>
					</Reveal>
				</div>
			</section>

			<div id="services"><FeaturesBlock eyebrow="حوزه‌های اصلی درمان" title="درمان، متناسب با بدن و مسیر زندگی شما" features={services} /></div>
			<StatsBlock items={clinicFacts} />

			<section className="relative overflow-hidden bg-[#123e46] px-4 py-20 text-white sm:py-24" id="treatment-path"><div className="absolute inset-0 opacity-20 [background-image:url('/images/brand/motion-path-texture.png')] [background-position:center] [background-size:cover]" /><div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.12em] text-[#b8ded7]">مسیر مراجعه و درمان</p><h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">از نخستین مراجعه تا بازگشت مطمئن به حرکت</h2><p className="mt-5 max-w-md leading-8 text-white/75">درمان موفق، یک فرآیند مشترک است: ارزیابی، برنامهٔ روشن و پیگیری مستمر.</p><Link href="/clinic" className="brand-link-ring mt-7 inline-flex items-center gap-2 font-bold text-[#b8ded7] hover:text-white">بیشتر دربارهٔ کلینیک بدانید <ChevronLeft className="size-4" /></Link></div><Stagger className="grid gap-4 md:grid-cols-3">{treatmentPath.map((item) => <StaggerItem key={item.step}><article className="h-full rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"><p className="text-sm font-extrabold text-[#b8ded7]">{item.step}</p><h3 className="mt-9 text-lg font-extrabold">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/75">{item.description}</p></article></StaggerItem>)}</Stagger></div></section>

			<BentoGrid eyebrow="رویکرد کلینیک" title="دانش روز، در خدمت تصمیم درمانی دقیق‌تر" cells={[
				{ title: "توان‌بخشی مبتنی بر شواهد", description: "روش درمان بر اساس ارزیابی، نیاز هر بیمار و همکاری با پزشک معالج انتخاب می‌شود.", span: 4, icon: ShieldCheck, visual: <div className="relative h-36 w-full"><Image src="/images/brand/manual-therapy.png" alt="درمان دستی در مرکز" fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover object-center" /></div> },
				{ title: "ارزیابی پیش از درمان", description: "بررسی شرح‌حال، موارد احتیاطی و وضعیت حرکت پیش از شروع برنامه.", span: 2, icon: ScanLine, visual: <ScanLine className="mb-5 size-16 text-[var(--brand-teal)]" /> },
				{ title: "برنامهٔ شخصی", description: "تمرین‌های مناسب برای کلینیک، خانه و محل کار.", span: 2, icon: Activity },
				{ title: "تمرین و پیگیری", description: "آموزش حرکت و پیگیری روند درمان در طول جلسات.", span: 2, icon: Footprints },
				{ title: "همکاری با پزشک معالج", description: "تصمیم‌گیری درمانی با توجه به نیاز و شرایط بیمار.", span: 2, icon: Stethoscope },
			]} />

			<section className="bg-[#edf5f3] px-4 py-20 sm:py-24"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div className="max-w-2xl"><p className="brand-overline">فضای کلینیک</p><h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#123e46] sm:text-4xl">محیطی برای تمرکز بر درمان و حرکت</h2></div><Link href="/clinic" className="brand-link-ring inline-flex items-center gap-2 font-bold text-[#123e46] hover:text-[#74364b]">مشاهدهٔ گالری کامل <ChevronLeft className="size-4" /></Link></div><Stagger className="mt-10 grid gap-4 md:grid-cols-3">{clinicPhotos.map((photo, index) => <StaggerItem key={photo} className={`relative overflow-hidden rounded-2xl bg-[#cddedb] ${index === 1 ? "md:translate-y-8" : ""}`}><div className="relative aspect-[4/5]"><Image src={photo} alt={`نمایی از فضای کلینیک فیزیوتراپی دکتر رحیمی ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" /></div></StaggerItem>)}</Stagger></div></section>

			<CareOptions />
			<InsuranceLogoCloud />
			<ClinicFaq />

			<section className="px-4 py-20 sm:py-24" id="contact"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#123e46] lg:grid-cols-[1.25fr_.75fr]"><div className="p-8 text-white sm:p-12"><p className="text-xs font-bold tracking-[0.12em] text-[#b8ded7]">وقت اقدام است</p><h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">برای شروع درمان، نوبت خود را درخواست کنید.</h2><p className="mt-4 max-w-xl leading-8 text-white/75">برای هماهنگی نوبت یا دریافت اطلاعات بیشتر، با کلینیک تماس بگیرید یا از مسیر نوبت‌دهی آنلاین وارد شوید.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/auth/login" className="brand-link-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-bold text-[#123e46] hover:bg-[#eaf4f1]"><CalendarDays className="size-5" />درخواست نوبت</Link><a href="tel:02177402528" className="brand-link-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 font-bold text-white hover:bg-white/10"><Phone className="size-5" /><bdi dir="ltr" className="whitespace-nowrap">021-77402528</bdi></a></div></div><div className="bg-[#4b8a83] p-8 text-white sm:p-12"><MapPin className="size-7" /><h3 className="mt-8 text-xl font-extrabold">دسترسی آسان در شرق تهران</h3><p className="mt-3 leading-8 text-white/85">خیابان پیروزی، بین خیابان سوم و چهارم نیروی هوایی، پلاک ۱۲۵، ساختمان پزشکان ادیب، مرکز فیزیوتراپی دکتر رحیمی.</p><div className="mt-6 border-t border-white/20 pt-5 text-sm leading-7 text-white/80"><Clock3 className="ml-2 inline size-4" />شنبه تا چهارشنبه: ۸ تا ۱۲ و ۱۵ تا ۲۰<br />پنجشنبه: ۸ تا ۱۲</div></div></div></section>

			<Footer />
		</div>
	);
}
