import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ThemeSwitcher from "@/components/preferences/ThemeSwitcher";

vi.mock("@/hooks", () => ({ useThemeSwitcher: () => ({ theme: "dark", handleToggle: vi.fn() }) }));

describe("ThemeSwitcher", () => {
	it("labels the English control in English", () => {
		render(<ThemeSwitcher locale="en" />);
		expect(screen.getByRole("button", { name: "Change theme; current setting: Dark" })).toBeInTheDocument();
	});

	it("keeps Persian labels on Persian routes", () => {
		render(<ThemeSwitcher />);
		expect(screen.getByRole("button", { name: /تغییر تم/ })).toBeInTheDocument();
	});
});
