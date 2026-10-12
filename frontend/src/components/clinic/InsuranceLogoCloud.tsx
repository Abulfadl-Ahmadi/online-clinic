import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

// The original four names follow text.txt, line 55; SOS was confirmed in the
// clinic's later request. Unsourced logos use typographic identities.
const organizations = [
	{ name: "تأمین اجتماعی", englishName: "Social Security", category: "بیمهٔ پایه", englishCategory: "Basic health insurance", logo: "/images/insurers/social-security.png" },
	{ name: "خدمات درمانی (بیمه سلامت)", englishName: "Medical Services (Iran Health Insurance)", category: "بیمهٔ پایه", englishCategory: "Basic health insurance" },
	{ name: "نیروهای مسلح", englishName: "Armed Forces", category: "بیمهٔ پایه", englishCategory: "Basic health insurance" },
	{ name: "بانک مرکزی", englishName: "Central Bank of Iran", category: "سازمان طرف قرارداد", englishCategory: "Partner organisation", logo: "/images/insurers/central-bank.png" },
	{ name: "بیمه کمک‌رسان SOS", englishName: "SOS Assistance Insurance", category: "بیمهٔ طرف قرارداد", englishCategory: "Partner insurance" },
];

export function InsuranceLogoCloud({ locale = "fa" }: { locale?: "fa" | "en" }) {
	const en = locale === "en";
	return (
		<section aria-labelledby="insurance-cloud-title" className="brand-soft-section px-4 py-20 sm:py-24" lang={locale} dir={en ? "ltr" : "rtl"}>
			<div className="mx-auto max-w-7xl">
				<Reveal className="max-w-3xl">
					<p className="brand-overline flex items-center gap-2"><ShieldCheck aria-hidden="true" className="size-4" />{en ? "SUPPORT FOR YOUR CARE" : "همراه شما در مسیر درمان"}</p>
					<h2 id="insurance-cloud-title" className="mt-3 text-3xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-4xl">{en ? "Insurance & partner organisations" : "بیمه‌ها و سازمان‌های طرف قرارداد"}</h2>
					<p className="mt-4 leading-8 text-[var(--brand-muted)]">{en ? "The clinic works with Iranian basic health insurers, the Central Bank of Iran and SOS Assistance Insurance." : "کلینیک با بیمه‌های پایه، بانک مرکزی و بیمه کمک‌رسان SOS همکاری دارد تا دسترسی به خدمات فیزیوتراپی آسان‌تر باشد."}</p>
				</Reveal>
				<Stagger className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5" stagger={0.045}>
					{organizations.map(({ name, englishName, category, englishCategory, ...organization }) => (
						<StaggerItem key={name} className="h-full">
							<div className="brand-card flex h-full min-h-48 flex-col items-center justify-center gap-3 rounded-[1.25rem] p-4 text-center sm:min-h-52 sm:p-6">
								{organization.logo ? <div className="relative size-16 sm:size-20"><Image src={organization.logo} alt="" fill sizes="80px" className="object-contain" /></div> : <div aria-hidden="true" className="flex size-16 items-center justify-center rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-soft)] text-3xl font-black text-[var(--brand-ink)] sm:size-20">{name.includes("SOS") ? "SOS" : en ? englishName.slice(0, 1) : name.slice(0, 1)}</div>}
								<span className="text-base font-extrabold leading-snug text-[var(--brand-ink)] sm:text-lg" lang={en ? "en" : "fa"}>{en ? englishName : name}</span>
								<span className="text-xs font-bold text-[var(--brand-muted)]">{en ? englishCategory : category}</span>
							</div>
						</StaggerItem>
					))}
				</Stagger>
				<p className="mt-6 text-sm leading-7 text-[var(--brand-muted)]">{en ? "Coverage depends on your policy and the service required. Please contact reception for details." : "میزان پوشش هر خدمت به نوع بیمه و شرایط پرونده بستگی دارد. برای جزئیات، با پذیرش هماهنگ کنید."}</p>
				<a href="tel:02177466628" className="brand-link-ring mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-[var(--brand-ink)] hover:text-[var(--brand-wine)]">{en ? "Ask about insurance coverage" : "استعلام پوشش بیمه"} <ArrowLeft aria-hidden="true" className="size-4" /></a>
			</div>
		</section>
	);
}
