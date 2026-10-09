import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InsuranceLogoCloud } from "@/components/clinic/InsuranceLogoCloud";

vi.mock("@/components/motion/Reveal", () => ({
	Reveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	Stagger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	StaggerItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("InsuranceLogoCloud", () => {
	it("names only source-listed organizations and qualifies coverage", () => {
		render(<InsuranceLogoCloud />);
		for (const name of ["تأمین اجتماعی", "خدمات درمانی", "نیروهای مسلح", "بانک مرکزی"]) {
			expect(screen.getByText(name)).toBeInTheDocument();
		}
		expect(screen.getByRole("heading", { name: "بیمه‌ها و سازمان‌های طرف قرارداد" })).toBeInTheDocument();
		expect(screen.getByText(/میزان پوشش هر خدمت به نوع بیمه/)).toBeInTheDocument();
		expect(screen.getByText("تأمین اجتماعی").parentElement?.querySelector('img')).toHaveAttribute("src", expect.stringContaining("social-security.png"));
		expect(screen.getByText("بانک مرکزی").parentElement?.querySelector('img')).toHaveAttribute("src", expect.stringContaining("central-bank.png"));
		expect(screen.getByText("خدمات درمانی").parentElement?.querySelector('img')).toBeNull();
		expect(screen.queryByText(/لوگوی رسمی|نام‌برده در معرفی/)).not.toBeInTheDocument();
		expect(screen.getByRole("link", { name: /استعلام پوشش بیمه/ })).toHaveAttribute("href", "tel:02177466628");
	});

	it("renders English labels without Persian-facing caveats", () => {
		render(<InsuranceLogoCloud locale="en" />);
		expect(screen.getByRole("heading", { name: "Insurance & partner organisations" })).toBeInTheDocument();
		expect(screen.getByText("Central Bank of Iran")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /Ask about insurance coverage/ })).toHaveAttribute("href", "tel:02177466628");
		expect(screen.queryByText(/لوگوی رسمی|نام‌برده در معرفی/)).not.toBeInTheDocument();
	});
});
