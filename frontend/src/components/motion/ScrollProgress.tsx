'use client';

import { motion, type SpringOptions, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { RefObject } from 'react';

export type ScrollProgressProps = {
  className?: string;
  springOptions?: SpringOptions;
  containerRef?: RefObject<HTMLDivElement>;
  direction?: 'ltr' | 'rtl';
};

const DEFAULT_SPRING_OPTIONS: SpringOptions = {
  stiffness: 200,
  damping: 50,
  restDelta: 0.001,
};

export function ScrollProgress({
  className,
  springOptions,
  containerRef,
  direction = 'rtl',
}: ScrollProgressProps) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const scaleX = useSpring(scrollYProgress, {
    ...DEFAULT_SPRING_OPTIONS,
    ...(springOptions ?? {}),
  });

  return (
    <motion.div
      aria-hidden="true"
      className={cn('fixed inset-x-0 top-0 z-[60] h-1 bg-[var(--brand-teal)]', direction === 'ltr' ? 'origin-left' : 'origin-right', className)}
      style={{ scaleX: reduceMotion ? 1 : scaleX }}
    />
  );
}
