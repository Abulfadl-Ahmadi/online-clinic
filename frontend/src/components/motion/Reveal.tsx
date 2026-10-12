"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface RevealProps extends PropsWithChildren {
	className?: string;
	delay?: number;
	amount?: number;
}

/** A single, accessible reveal used across public-facing pages. */
export function Reveal({ children, className, delay = 0, amount = 0.18 }: RevealProps) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			className={className}
			initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount, margin: "0px 0px -48px 0px" }}
			transition={{ duration: shouldReduceMotion ? 0 : 0.38, delay: shouldReduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>
			{children}
		</motion.div>
	);
}

interface StaggerProps extends PropsWithChildren {
	className?: string;
	stagger?: number;
}

/** Reveals direct children sequentially after their group reaches the viewport. */
export function Stagger({ children, className, stagger = 0.055 }: StaggerProps) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			className={className}
			initial={shouldReduceMotion ? false : "hidden"}
			whileInView="show"
			viewport={{ once: true, amount: 0.12 }}
			variants={{
				hidden: {},
				show: { transition: { staggerChildren: shouldReduceMotion ? 0 : stagger } },
			}}>
			{children}
		</motion.div>
	);
}

interface StaggerItemProps extends PropsWithChildren {
	className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			className={className}
			variants={{
				hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
				show: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] } },
			}}>
			{children}
		</motion.div>
	);
}
