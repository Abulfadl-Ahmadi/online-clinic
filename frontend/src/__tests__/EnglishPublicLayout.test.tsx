import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EnglishPublicLayout } from "@/components/layout/EnglishPublicLayout";

vi.mock("@/components/motion/ScrollProgress", () => ({ ScrollProgress: () => null }));
vi.mock("@/components/preferences/ThemeSwitcher", () => ({ default: () => <button>Change theme</button> }));
vi.mock("@/components/layout/LocaleSwitchLink", () => ({ LocaleSwitchLink: () => <a href="/clinic">فارسی</a> }));

describe("English public layout", () => {
  it("exposes Persian-portal booking in desktop and mobile navigation", () => {
    render(<EnglishPublicLayout><h1>Clinic</h1></EnglishPublicLayout>);
    expect(screen.getByRole("navigation", { name: "English mobile navigation" })).toContainElement(
      screen.getAllByRole("link", { name: "Book (Persian portal)" })[1],
    );
    expect(screen.getAllByRole("link", { name: "Book (Persian portal)" })).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getAllByRole("link", { name: "Book (Persian portal)" })[0]).toHaveAttribute("href", "/auth/login");
  });
});
