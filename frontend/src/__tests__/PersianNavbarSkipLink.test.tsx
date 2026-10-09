import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Navbar from "@/components/layout/navbar/Navbar";

vi.mock("@/components/layout/navbar/NavLinks", () => ({ default: () => null }));
vi.mock("@/components/layout/navbar/NavMenuButton", () => ({ default: () => null }));
vi.mock("@/components/user", () => ({ UserMenu: () => null }));
vi.mock("@/components/preferences/ThemeSwitcher", () => ({ default: () => null }));
vi.mock("@/components/common", () => ({ LogoType: () => null }));
vi.mock("@/components/layout/LocaleSwitchLink", () => ({ LocaleSwitchLink: () => null }));

describe("Persian public navigation", () => {
  it("offers a keyboard skip link before navigation", () => {
    const { container } = render(<Navbar onOpenSidebar={() => {}} />);
    expect(screen.getByRole("link", { name: "پرش به محتوای اصلی" })).toHaveAttribute("href", "#main-content");
    expect(container.firstElementChild).toBeInTheDocument();
  });
});
