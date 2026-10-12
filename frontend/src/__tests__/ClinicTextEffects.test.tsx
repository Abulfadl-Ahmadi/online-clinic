import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiaTextReveal, Highlighter, KineticText, ShinyText } from '@/components/motion/ClinicTextEffects';

vi.mock('framer-motion', () => ({
  useInView: () => true,
  useReducedMotion: () => false,
  motion: { span: ({ children }: { children: React.ReactNode }) => <span aria-hidden="true">{children}</span> },
}));

describe('Magic UI-inspired text accents', () => {
  it('keeps content readable and accessible without duplicating kinetic text', () => {
    render(<><ShinyText>دانش روز</ShinyText><DiaTextReveal>بازگشت به حرکت</DiaTextReveal><Highlighter>ارزیابی</Highlighter><KineticText text="گالری" /></>);
    expect(screen.getByText('دانش روز')).toBeInTheDocument();
    expect(screen.getByText('بازگشت به حرکت')).toHaveAttribute('data-revealed', 'true');
    expect(screen.getByText('ارزیابی')).toHaveAttribute('data-revealed', 'true');
    expect(screen.getByLabelText('گالری')).toHaveAttribute('tabindex', '0');
    expect(screen.getByLabelText('گالری').querySelectorAll('[aria-hidden="true"]')).toHaveLength(5);
  });
});
