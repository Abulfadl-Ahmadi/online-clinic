import type { ComponentType, ReactNode } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export interface BentoCell {
	icon?: ComponentType<{ className?: string }>;
	title: string;
	description: string;
	span?: 2 | 3 | 4;
	visual?: ReactNode;
}

const spans = { 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4" };

/** VibeFarsi six-column bento, using the existing clinic theme. */
export function BentoGrid({ eyebrow, title, cells }: { eyebrow?: string; title?: string; cells: BentoCell[] }) {
	return <section className="px-4 py-20 sm:py-24" aria-label={title}>
		<div className="mx-auto max-w-7xl">
			{(eyebrow || title) && <Reveal className="mb-10 max-w-2xl">
				{eyebrow && <p className="brand-overline">{eyebrow}</p>}
				{title && <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-4xl">{title}</h2>}
			</Reveal>}
			<Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
				{cells.map((cell) => <StaggerItem key={cell.title} className={spans[cell.span ?? 2]}><article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)]">
					{cell.visual && <div className="flex h-36 items-end justify-center overflow-hidden border-b border-[var(--brand-line)] bg-[var(--brand-soft)] px-5 pt-5">{cell.visual}</div>}
					<div className="p-6"><div className="flex items-center gap-2 text-[var(--brand-ink)]">{cell.icon && <cell.icon className="size-5" />}<h3 className="text-lg font-bold">{cell.title}</h3></div><p className="mt-2 leading-7 text-[var(--brand-muted)]">{cell.description}</p></div>
				</article></StaggerItem>)}
			</Stagger>
		</div>
	</section>;
}
