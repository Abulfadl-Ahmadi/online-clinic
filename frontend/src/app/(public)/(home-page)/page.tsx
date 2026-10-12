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
	GraduationCap,
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
import { DiaTextReveal, Highlighter, ShinyText } from "@/components/motion/ClinicTextEffects";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Footer } from "@/components/layout";

const credibility = [
	{ value: "خیابان پیروزی", label: "محل فعالیت کلینیک در شرق تهران" },
	{ value: "+۱۰۰", label: "مقاله و فعالیت علمی" },
	{ value: "۱۶۰ متر", label: "فضای تخصصی درمان" },
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
			<section className="brand-motion-field relative isolate overflow-hidden px-4 pb-20 pt-16 sm:pb-24 sm:pt-20">
				<div className="brand-grid absolute inset-0 -z-10 opacity-60" />
				<div className="absolute -right-24 top-0 -z-10 size-72 rounded-full bg-[#4b8a83]/15 blur-3xl" />
				<div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-8">
					<Reveal className="order-2 lg:order-1">
						<p className="brand-overline mb-5 flex items-center gap-2"><span className="h-px w-8 bg-[#74364b]" /><ShinyText>کلینیک فیزیوتراپی دکتر عباس رحیمی</ShinyText></p>
						<h1 className="max-w-3xl text-4xl font-extrabold leading-[1.32] tracking-tight text-[#123e46] sm:text-5xl lg:text-6xl">بازگشت به حرکت،<DiaTextReveal className="block">با پشتوانهٔ علم.</DiaTextReveal></h1>
						<p className="mt-6 max-w-2xl text-base leading-8 text-[#415357] sm:text-lg">از ارزیابی دقیق تا برنامهٔ درمانی شخصی، در کنار شما هستیم تا با توان‌بخشی مبتنی بر شواهد، با اطمینان بیشتری به زندگی روزمره و حرکت بازگردید.</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
							<Link href="/auth/login" className="brand-link-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#123e46] px-6 font-bold text-white shadow-lg shadow-[#123e46]/15 transition-transform hover:-translate-y-0.5 hover:bg-[#0d3239]"><CalendarDays className="size-5" />درخواست نوبت آنلاین<ArrowLeft className="size-4" /></Link>
							<a href="tel:02177402528" className="brand-link-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#123e46]/15 bg-white/70 px-6 font-bold text-[#123e46] transition-colors hover:bg-white"><Phone className="size-5" />تماس با کلینیک</a>
						</div>
						<div className="mt-10 grid max-w-xl grid-cols-3 border-t border-[#123e46]/10 pt-6">
							{credibility.map((item) => <div key={item.label} className="px-3 first:pr-0 last:border-r last:border-[#123e46]/10"><p className="text-xl font-extrabold text-[#123e46] sm:text-2xl">{item.value}</p><p className="mt-1 text-xs leading-5 text-[#526468] sm:text-sm">{item.label}</p></div>)}
						</div>
					</Reveal>
					<Reveal delay={0.12} className="relative order-1 mx-auto w-full max-w-xl lg:order-2 lg:max-w-none">
						<div className="absolute -inset-4 rounded-[2rem] border border-white/70 bg-white/25" />
						<div className="relative aspect-[1.54] overflow-hidden rounded-[1.65rem] bg-[#dceae7] shadow-2xl shadow-[#123e46]/15"><Image src="/images/brand/dr-abbas-rahimi-hero.png" alt="دکتر عباس رحیمی در فضای توان‌بخشی کلینیک" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#09252b]/90 via-[#09252b]/65 to-transparent px-5 pb-16 pt-5 text-white sm:px-8 sm:pb-24 sm:pt-7"><p className="max-w-lg text-xl font-black leading-snug drop-shadow-md sm:text-3xl lg:text-4xl">مرکز فیزیوتراپی دکتر رحیمی</p></div></div>
						<div className="absolute -bottom-5 right-5 max-w-[14rem] rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)]/95 p-4 shadow-xl backdrop-blur sm:right-8"><div className="flex items-start gap-3"><div className="rounded-xl bg-[#e1f0ec] p-2 text-[#123e46]"><GraduationCap className="size-5" /></div><p className="text-sm font-bold leading-6 text-[var(--brand-ink)]">استاد تمام دانشگاه علوم پزشکی شهید بهشتی</p></div></div>
					</Reveal>
				</div>
			</section>

			<section className="px-4 py-20 sm:py-28" id="services"><div className="mx-auto max-w-7xl"><Reveal className="max-w-2xl"><p className="brand-overline">حوزه‌های اصلی درمان</p><h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-4xl">درمان، متناسب با بدن و مسیر زندگی شما</h2><p className="mt-4 leading-8 text-[var(--brand-muted)]">هر برنامه از یک ارزیابی دقیق آغاز می‌شود؛ نه از یک نسخهٔ یکسان برای همه.</p></Reveal><Stagger className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{services.map((service) => { const Icon = service.icon; return <StaggerItem key={service.title}><article className="brand-card group h-full rounded-2xl p-6"><div className="flex size-11 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-ink)] transition-transform duration-300 group-hover:scale-105"><Icon className="size-5" /></div><h3 className="mt-5 text-lg font-extrabold text-[var(--brand-ink)]">{service.title}</h3><p className="mt-2 leading-7 text-[var(--brand-muted)]">{service.description}</p></article></StaggerItem>; })}</Stagger></div></section>

			<section className="relative overflow-hidden bg-[#123e46] px-4 py-20 text-white sm:py-24" id="treatment-path"><div className="absolute inset-0 opacity-20 [background-image:url('/images/brand/motion-path-texture.png')] [background-position:center] [background-size:cover]" /><div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.12em] text-[#b8ded7]">مسیر مراجعه و درمان</p><h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">از نخستین مراجعه تا بازگشت مطمئن به حرکت</h2><p className="mt-5 max-w-md leading-8 text-white/75">درمان موفق، یک فرآیند مشترک است: ارزیابی، برنامهٔ روشن و پیگیری مستمر.</p><Link href="/clinic" className="brand-link-ring mt-7 inline-flex items-center gap-2 font-bold text-[#b8ded7] hover:text-white">بیشتر دربارهٔ کلینیک بدانید <ChevronLeft className="size-4" /></Link></div><Stagger className="grid gap-4 md:grid-cols-3">{treatmentPath.map((item) => <StaggerItem key={item.step}><article className="h-full rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"><p className="text-sm font-extrabold text-[#b8ded7]">{item.step}</p><h3 className="mt-9 text-lg font-extrabold">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/75">{item.description}</p></article></StaggerItem>)}</Stagger></div></section>

			<section className="px-4 py-20 sm:py-24"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center"><div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[#d8e8e5]"><Image src="/images/brand/manual-therapy.png" alt="درمان دستی و ارزیابی تخصصی در کلینیک" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#123e46]/75 to-transparent p-6 pt-20 text-white"><p className="text-sm font-bold">دانش روز، در خدمت تصمیم درمانی دقیق‌تر</p></div></div><div><p className="brand-overline">رویکرد کلینیک</p><h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#123e46] sm:text-4xl">توان‌بخشی <Highlighter>مبتنی بر شواهد</Highlighter>، متناسب با نیاز هر بیمار</h2><p className="mt-5 leading-8 text-[#526468]">در کلینیک فیزیوتراپی دکتر رحیمی، انتخاب روش‌های درمانی بر پایهٔ ارزیابی بیمار، دانش روز و همکاری با پزشک معالج انجام می‌شود. هدف، کاهش درد به‌تنهایی نیست؛ هدف، بازگشت ایمن و پایدار به عملکرد روزمره است.</p><ul className="mt-6 space-y-3 text-[#415357]">{["بررسی موارد احتیاطی و علائم هشدار پیش از درمان", "برنامهٔ اختصاصی برای کلینیک، خانه و محل کار", "پیگیری روند درمان و ارتباط مستمر با پزشک معالج"].map((item) => <li key={item} className="flex items-start gap-3"><ShieldCheck className="mt-1 size-5 shrink-0 text-[#4b8a83]" />{item}</li>)}</ul></div></div></section>

			<section className="bg-[#edf5f3] px-4 py-20 sm:py-24"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div className="max-w-2xl"><p className="brand-overline">فضای کلینیک</p><h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#123e46] sm:text-4xl">محیطی برای تمرکز بر درمان و حرکت</h2></div><Link href="/clinic" className="brand-link-ring inline-flex items-center gap-2 font-bold text-[#123e46] hover:text-[#74364b]">مشاهدهٔ گالری کامل <ChevronLeft className="size-4" /></Link></div><Stagger className="mt-10 grid gap-4 md:grid-cols-3">{clinicPhotos.map((photo, index) => <StaggerItem key={photo} className={`relative overflow-hidden rounded-2xl bg-[#cddedb] ${index === 1 ? "md:translate-y-8" : ""}`}><div className="relative aspect-[4/5]"><Image src={photo} alt={`نمایی از فضای کلینیک فیزیوتراپی دکتر رحیمی ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" /></div></StaggerItem>)}</Stagger></div></section>

			<CareOptions />
			<InsuranceLogoCloud />
			<ClinicFaq />

			<section className="px-4 py-20 sm:py-24" id="contact"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#123e46] lg:grid-cols-[1.25fr_.75fr]"><div className="p-8 text-white sm:p-12"><p className="text-xs font-bold tracking-[0.12em] text-[#b8ded7]">وقت اقدام است</p><h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">برای شروع درمان، نوبت خود را درخواست کنید.</h2><p className="mt-4 max-w-xl leading-8 text-white/75">برای هماهنگی نوبت یا دریافت اطلاعات بیشتر، با کلینیک تماس بگیرید یا از مسیر نوبت‌دهی آنلاین وارد شوید.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/auth/login" className="brand-link-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-bold text-[#123e46] hover:bg-[#eaf4f1]"><CalendarDays className="size-5" />درخواست نوبت</Link><a href="tel:02177402528" className="brand-link-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 font-bold text-white hover:bg-white/10"><Phone className="size-5" /><bdi dir="ltr" className="whitespace-nowrap">021-77402528</bdi></a></div></div><div className="bg-[#4b8a83] p-8 text-white sm:p-12"><MapPin className="size-7" /><h3 className="mt-8 text-xl font-extrabold">دسترسی آسان در شرق تهران</h3><p className="mt-3 leading-8 text-white/85">خیابان پیروزی، بین خیابان سوم و چهارم نیروی هوایی، پلاک ۱۲۵، ساختمان پزشکان ادیب، مرکز فیزیوتراپی دکتر رحیمی.</p><div className="mt-6 border-t border-white/20 pt-5 text-sm leading-7 text-white/80"><Clock3 className="ml-2 inline size-4" />شنبه تا چهارشنبه: ۸ تا ۱۲ و ۱۵ تا ۲۰<br />پنجشنبه: ۸ تا ۱۲</div></div></div></section>

			<Footer />
		</div>
	);
}
