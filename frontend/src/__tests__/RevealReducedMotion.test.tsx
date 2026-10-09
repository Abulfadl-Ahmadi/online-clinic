import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const reduced = vi.hoisted(() => ({ value: false, motionProps: [] as Record<string, unknown>[] }));
vi.mock("framer-motion", () => ({
  useReducedMotion: () => reduced.value,
  motion: { div: ({ children, ...props }: { children: React.ReactNode }) => {
    reduced.motionProps.push(props);
    return <div>{children}</div>;
  } },
}));

beforeEach(() => { reduced.value = false; reduced.motionProps.length = 0; });

describe("public content reveals", () => {
  it("removes entrance, delay and stagger when reduced motion is requested", () => {
    reduced.value = true;
    render(<><Reveal delay={0.8}>Introduction</Reveal><Stagger><StaggerItem>Service</StaggerItem></Stagger></>);
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    const [reveal, stagger, item] = reduced.motionProps;
    expect(reveal.initial).toBe(false);
    expect(reveal.transition).toMatchObject({ duration: 0, delay: 0 });
    expect(stagger.initial).toBe(false);
    expect((stagger.variants as { show: { transition: { staggerChildren: number } } }).show.transition.staggerChildren).toBe(0);
    expect((item.variants as { show: { transition: { duration: number } } }).show.transition.duration).toBe(0);
  });

  it("preserves purposeful entrance and timing without reduced motion", () => {
    render(<Reveal delay={0.2}>Introduction</Reveal>);
    expect(reduced.motionProps[0].initial).toEqual({ opacity: 0, y: 28 });
    expect(reduced.motionProps[0].transition).toMatchObject({ delay: 0.2, duration: 0.58 });
  });
});
