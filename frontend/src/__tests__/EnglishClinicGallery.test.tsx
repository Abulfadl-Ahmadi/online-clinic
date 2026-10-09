import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClinicGallery } from "@/components/clinic/ClinicGallery";

vi.mock("@/components/motion/Reveal", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Stagger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StaggerItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("English clinic gallery", () => {
  it("translates image controls and the expanded image dialog", () => {
    render(<ClinicGallery locale="en" images={["/images/general/clinic/photo_2025-12-17_03-25-39.jpg"]} />);
    expect(screen.getByRole("heading", { name: "Explore the clinic" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Enlarge clinic photo 1" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("dir", "ltr");
    expect(screen.getByRole("dialog")).toHaveTextContent("Inside Dr. Rahimi’s physiotherapy clinic");
    expect(screen.getAllByAltText("View 1 of Dr. Rahimi's physiotherapy clinic")).toHaveLength(2);
  });
});
