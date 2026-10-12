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
    expect(screen.getByRole("dialog")).toHaveClass("gallery-viewer");
    expect(screen.getByRole("dialog")).not.toHaveClass("bg-transparent");
    expect(screen.getByRole("dialog")).toHaveTextContent("Inside Dr. Rahimi’s physiotherapy clinic");
    expect(screen.getAllByAltText("View 1 of Dr. Rahimi's physiotherapy clinic")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Next clinic photo" })).toBeInTheDocument();
  });

  it("navigates between photos and wraps around without closing the dialog", () => {
    const images = ["/images/general/clinic/photo_2025-12-17_03-25-39.jpg", "/images/general/clinic/photo_2025-12-17_03-26-03.jpg"];
    render(<ClinicGallery locale="en" images={images} />);
    fireEvent.click(screen.getByRole("button", { name: "Enlarge clinic photo 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Next clinic photo" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("2 / 2");
    expect(screen.getAllByAltText("View 2 of Dr. Rahimi's physiotherapy clinic")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Next clinic photo" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("1 / 2");
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowRight" });
    expect(screen.getByRole("dialog")).toHaveTextContent("2 / 2");
  });

  it("opens a readable viewer with close and nearby-photo controls", () => {
    const images = ["/images/general/clinic/photo_2025-12-17_03-25-39.jpg", "/images/general/clinic/photo_2025-12-17_03-26-03.jpg"];
    render(<ClinicGallery locale="en" images={images} />);
    fireEvent.click(screen.getByRole("button", { name: "Enlarge clinic photo 1" }));
    expect(screen.getByRole("button", { name: "Close gallery" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show photo 2" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("2 / 2");
    fireEvent.click(screen.getByRole("button", { name: "Close gallery" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows an intentional empty state when no photos exist", () => {
    render(<ClinicGallery locale="en" images={[]} />);
    expect(screen.getByText("Clinic photos will appear here soon.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Enlarge clinic photo/ })).not.toBeInTheDocument();
  });
});
