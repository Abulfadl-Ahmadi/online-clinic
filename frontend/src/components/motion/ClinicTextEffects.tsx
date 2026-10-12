"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/** Subtle glare inspired by Magic UI Animated Shiny Text; the text remains legible at rest. */
export function ShinyText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`clinic-shiny-text ${className}`}>{children}</span>;
}

/** One-time color sweep inspired by Magic UI Dia Text Reveal. */
export function DiaTextReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  return <span ref={ref} className={`clinic-dia-text ${className}`} data-revealed={inView && !reduced ? "true" : "false"}>{children}</span>;
}

/** Marker-like underline inspired by Magic UI Highlighter, without adding a drawing dependency. */
export function Highlighter({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  return <span ref={ref} className={`clinic-highlighter ${className}`} data-revealed={inView || reduced ? "true" : "false"}>{children}</span>;
}

/** Pointer/focus font-weight reaction inspired by Magic UI Kinetic Text. */
export function KineticText({ text, className = "" }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  return <span className={`clinic-kinetic ${className}`} aria-label={text} tabIndex={0}>
    {[...text].map((char, index) => <motion.span aria-hidden="true" key={`${index}-${char}`} className="clinic-kinetic-letter" whileHover={reduced ? undefined : { scale: 1.14, y: -3, fontWeight: 900 }} transition={{ duration: 0.2 }} style={{ display: "inline-block", whiteSpace: "pre" }}>{char}</motion.span>)}
  </span>;
}
