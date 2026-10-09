import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleSwitchLink, localeDestination } from "@/components/layout/LocaleSwitchLink";
import { usePathname } from "next/navigation";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

beforeEach(() => vi.mocked(usePathname).mockReturnValue("/en/clinic"));

describe("locale navigation", () => {
  it.each([
    ["/", "en", "/en"], ["/about-us", "en", "/en/about"],
    ["/clinic", "en", "/en/clinic"], ["/articles", "en", "/en/articles"],
    ["/en/about", "fa", "/about-us"], ["/en/clinic", "fa", "/clinic"],
    ["/en/articles", "fa", "/articles"], ["/articles/example", "en", "/en/articles"],
  ] as const)("maps %s to %s equivalent %s", (path, locale, result) => {
    expect(localeDestination(path, locale)).toBe(result);
  });

  it("links to the corresponding page, not the home page", () => {
    render(<LocaleSwitchLink target="fa" />);
    expect(screen.getByRole("link", { name: "فارسی" })).toHaveAttribute("href", "/clinic");
    expect(screen.getByRole("link", { name: "فارسی" })).toHaveAttribute("hreflang", "fa");
  });
});
