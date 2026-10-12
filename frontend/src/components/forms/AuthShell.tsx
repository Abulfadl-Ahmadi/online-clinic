import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, HeartPulse, ShieldCheck } from "lucide-react";

/** Shared RTL entry surface: a quiet clinical photo, with the task always first on mobile. */
export function AuthShell({ children, title, description }: {
	children: ReactNode;
	title: string;
	description: string;
}) {
	return <div className="brand-page auth-stage relative min-h-dvh overflow-hidden px-4 pb-12 pt-28 sm:px-8 sm:pt-32" dir="rtl">
		<div className="auth-stage-grid pointer-events-none absolute inset-0" aria-hidden="true" />
		<div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)] lg:gap-16">
			<div className="auth-panel order-1 mx-auto w-full max-w-lg rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-6 sm:p-10">
				<p className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)]"><HeartPulse aria-hidden="true" className="size-5" />مرکز فیزیوتراپی دکتر رحیمی</p>
				<h1 className="text-3xl font-extrabold leading-snug text-[var(--brand-ink)] sm:text-4xl">{title}</h1>
				<p className="mt-3 leading-8 text-[var(--brand-muted)]">{description}</p>
				<div className="mt-8">{children}</div>
				<div className="mt-8 border-t border-[var(--brand-line)] pt-5 text-sm text-[var(--brand-muted)]">
					<ShieldCheck aria-hidden="true" className="me-2 inline size-4 text-[var(--brand-teal)]" />کد تأیید خود را با دیگران به اشتراک نگذارید.
				</div>
			</div>
			<aside className="auth-photo order-2 hidden overflow-hidden rounded-2xl border border-[var(--brand-line)] lg:block">
				<div className="relative aspect-[4/5] overflow-hidden bg-[var(--brand-soft)]"><Image src="/images/brand/dr-abbas-rahimi-hero.png" alt="دکتر عباس رحیمی در کلینیک فیزیوتراپی" fill sizes="(max-width: 1024px) 0px, 45vw" className="object-cover object-[62%_center]" /></div>
				<div className="flex items-center justify-between gap-4 bg-[var(--brand-surface)] p-5"><div><p className="font-extrabold text-[var(--brand-ink)]">دکتر عباس رحیمی</p><p className="mt-1 text-sm text-[var(--brand-muted)]">ارزیابی دقیق، درمان متناسب با شما</p></div><Link href="/clinic" className="brand-link-ring inline-flex min-h-11 items-center gap-1 font-bold text-[var(--brand-ink)]">آشنایی با کلینیک<ArrowLeft aria-hidden="true" className="size-4" /></Link></div>
			</aside>
		</div>
	</div>;
}
