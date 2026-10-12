import { Reveal } from "@/components/motion/Reveal";

export interface StatItem { value: string; label: string; hint?: string }

/** VibeFarsi stats strip. Supply only verified figures, already in Persian digits. */
export function StatsBlock({ items }: { items: StatItem[] }) {
	return <section className="px-4 py-12" aria-label="اطلاعات مرکز">
		<Reveal><dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-line)] lg:grid-cols-4">
			{items.map((item) => <div key={item.label} className="bg-[var(--brand-surface)] p-6 text-center">
				<dt className="text-sm text-[var(--brand-muted)]">{item.label}</dt>
				<dd className="mt-2 text-xl font-extrabold tabular-nums text-[var(--brand-ink)] sm:text-2xl">{item.value}</dd>
				{item.hint && <p className="mt-2 text-xs text-[var(--brand-muted)]">{item.hint}</p>}
			</div>)}
		</dl></Reveal>
	</section>;
}
