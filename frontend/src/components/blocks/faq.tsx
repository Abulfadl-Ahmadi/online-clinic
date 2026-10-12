"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem { id: string; title: string; content: ReactNode }

/** VibeFarsi FAQ: right-hand introduction and accessible grid-row accordion. */
export function FaqBlock({ items, eyebrow = "پیش از مراجعه", title = "پاسخ به پرسش‌های رایج شما", description }: {
	items: FaqItem[];
	eyebrow?: string;
	title?: string;
	description?: string;
}) {
	const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
	return <section className="brand-soft-section px-4 py-20 sm:py-24" aria-labelledby="faq-title">
		<div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
			<div><p className="brand-overline">{eyebrow}</p><h2 id="faq-title" className="mt-3 text-3xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-4xl">{title}</h2>{description && <p className="mt-5 leading-8 text-[var(--brand-muted)]">{description}</p>}</div>
			<div className="overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)]">
				{items.map((item) => { const open = item.id === openId; const panelId = `clinic-faq-panel-${item.id}`; return <div key={item.id} className="border-b border-[var(--brand-line)] last:border-b-0">
					<h3><button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpenId(open ? null : item.id)} className="brand-link-ring flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-start font-bold text-[var(--brand-ink)] transition-colors hover:bg-[var(--brand-soft)]">
						{item.title}<ChevronDown aria-hidden="true" className={`size-5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
					</button></h3>
					<div id={panelId} aria-hidden={!open} className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><div className="overflow-hidden"><div className="px-6 pb-5 leading-8 text-[var(--brand-muted)]">{item.content}</div></div></div>
				</div>; })}
			</div>
		</div>
	</section>;
}
