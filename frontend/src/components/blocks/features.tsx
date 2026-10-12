import type { ComponentType } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export interface Feature {
	icon: ComponentType<{ className?: string }>;
	title: string;
	description: string;
}

/** VibeFarsi features block, adapted to the clinic's existing brand tokens. */
export function FeaturesBlock({ eyebrow, title, features, columns = 3 }: {
	eyebrow?: string;
	title?: string;
	features: Feature[];
	columns?: 3 | 4;
}) {
	return (
		<section className="px-4 py-20 sm:py-28" aria-label={title}>
			<div className="mx-auto max-w-7xl">
				{(eyebrow || title) && <Reveal className="mb-10 max-w-2xl">
					{eyebrow && <p className="brand-overline">{eyebrow}</p>}
					{title && <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--brand-ink)] sm:text-4xl">{title}</h2>}
				</Reveal>}
				<Stagger className={`grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-line)] sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
					{features.map(({ icon: Icon, title: featureTitle, description }) => <StaggerItem key={featureTitle} className="bg-[var(--brand-surface)]"><article className="h-full p-6">
						<span className="flex size-10 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand-ink)]"><Icon className="size-5" /></span>
						<h3 className="mt-4 text-lg font-bold text-[var(--brand-ink)]">{featureTitle}</h3>
						<p className="mt-2 leading-8 text-[var(--brand-muted)]">{description}</p>
					</article></StaggerItem>)}
				</Stagger>
			</div>
		</section>
	);
}
