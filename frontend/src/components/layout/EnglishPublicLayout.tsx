import Link from "next/link";
import { Activity, CalendarDays, Clock3, MapPin, Phone } from "lucide-react";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import ThemeSwitcher from "@/components/preferences/ThemeSwitcher";
import { LocaleSwitchLink } from "./LocaleSwitchLink";
import type { PropsWithChildren } from "react";

const navigation = [
	{ href: "/en", label: "Home" },
	{ href: "/en/about", label: "Dr. Rahimi" },
	{ href: "/en/clinic", label: "Clinic" },
	{ href: "/en/articles", label: "Articles" },
];

export function EnglishPublicLayout({ children }: PropsWithChildren) {
	return (
		<div className="brand-page min-h-screen" dir="ltr" lang="en">
			<a href="#main-content" className="brand-skip-link">Skip to content</a>
			<ScrollProgress direction="ltr" />
			<header className="sticky top-0 z-50 border-b border-[var(--brand-line)] bg-[var(--brand-page)]/95 px-4 py-3 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
					<Link href={"/en" as never} className="brand-link-ring flex items-center gap-3 text-[var(--brand-ink)]">
						<span className="flex size-10 items-center justify-center rounded-xl bg-[#123e46] text-white dark:bg-[#b8ded7] dark:text-[#09252b]"><Activity className="size-5" /></span>
						<span className="text-sm font-extrabold leading-tight sm:text-base">Dr. Abbas Rahimi<span className="block text-xs font-medium text-[var(--brand-muted)]">Physiotherapy Clinic</span></span>
					</Link>
					<nav aria-label="English navigation" className="hidden items-center gap-5 text-sm font-bold text-[var(--brand-copy)] md:flex">
						{navigation.map((item) => <Link key={item.href} href={item.href as never} className="brand-link-ring hover:text-[var(--brand-ink)]">{item.label}</Link>)}
					</nav>
					<div className="flex items-center gap-3">
						<ThemeSwitcher locale="en" />
						<LocaleSwitchLink target="fa" className="brand-link-ring inline-flex min-h-11 items-center text-sm font-bold text-[var(--brand-ink)] hover:text-[var(--brand-wine)]" />
						<Link href="/auth/login" lang="en" title="Booking portal is currently available in Persian" className="brand-link-ring hidden min-h-11 items-center gap-2 rounded-xl bg-[#123e46] px-4 text-sm font-bold text-white hover:bg-[#0d3239] sm:inline-flex"><CalendarDays className="size-4" />Book (Persian portal)</Link>
					</div>
				</div>
				<nav aria-label="English mobile navigation" className="mx-auto mt-3 flex max-w-7xl gap-1 overflow-x-auto border-t border-[var(--brand-line)] pt-2 text-sm font-bold text-[var(--brand-copy)] md:hidden">
					{navigation.map((item) => <Link key={item.href} href={item.href as never} className="brand-link-ring inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 hover:bg-[var(--brand-soft)] hover:text-[var(--brand-ink)]">{item.label}</Link>)}
					<Link href="/auth/login" className="brand-link-ring inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 text-[var(--brand-ink)] hover:bg-[var(--brand-soft)]">Book (Persian portal)</Link>
				</nav>
			</header>
			<main id="main-content" tabIndex={-1}>{children}</main>
			<footer className="bg-[#123e46] px-4 py-14 text-white">
				<div className="mx-auto grid max-w-7xl gap-9 md:grid-cols-[1.2fr_.8fr_.8fr]">
					<div><p className="text-xl font-extrabold">Dr. Abbas Rahimi Physiotherapy Clinic</p><p className="mt-4 max-w-md leading-7 text-white/70">Evidence-informed rehabilitation, delivered with clinical experience and attention to each person&apos;s return to movement.</p></div>
					<div><p className="font-bold">Contact</p><div className="mt-4 space-y-3 text-sm text-white/75"><a href="tel:02177402525" className="flex items-center gap-2 hover:text-white"><Phone className="size-4 text-[#9fd4cc]" />+98 21 7740 2525</a><a href="tel:02177466628" className="flex items-center gap-2 hover:text-white"><Phone className="size-4 text-[#9fd4cc]" />+98 21 7746 6628</a><p className="flex items-start gap-2"><Clock3 className="mt-0.5 size-4 shrink-0 text-[#9fd4cc]" />Sat–Wed: 8–12 &amp; 15–20<br />Thu: 8–12</p></div></div>
					<div><p className="font-bold">Location</p><p className="mt-4 flex items-start gap-2 text-sm leading-7 text-white/75"><MapPin className="mt-1 size-4 shrink-0 text-[#9fd4cc]" />No. 125, Adib Medical Building, Pirouzi St., Tehran, Iran</p></div>
				</div>
				<div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-6 text-sm text-white/50">© 2026 Dr. Abbas Rahimi Physiotherapy Clinic. All rights reserved.</div>
			</footer>
		</div>
	);
}
