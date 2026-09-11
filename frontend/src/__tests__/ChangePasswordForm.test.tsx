import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChangePasswordForm } from "@/components/forms";

// Mock the server action
vi.mock("@/actions", () => ({
	changePasswordAction: vi.fn().mockResolvedValue({
		success: true,
		message: "رمز عبور با موفقیت تغییر یافت",
	}),
}));

describe("ChangePasswordForm", () => {
	it("renders all password fields and submit button", () => {
		render(<ChangePasswordForm />);

		expect(screen.getByText("رمز عبور فعلی")).toBeInTheDocument();
		expect(screen.getByText("رمز عبور جدید")).toBeInTheDocument();
		expect(screen.getByText("تکرار رمز عبور جدید")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "تغییر رمز عبور" }),
		).toBeInTheDocument();
	});

	it("shows validation error on empty submission", async () => {
		render(<ChangePasswordForm />);

		const submitBtn = screen.getByRole("button", { name: "تغییر رمز عبور" });
		fireEvent.click(submitBtn);

		await waitFor(() => {
			expect(screen.getByText("رمز عبور فعلی الزامی است")).toBeInTheDocument();
		});
	});

	it("toggles password visibility when eye button is clicked", () => {
		render(<ChangePasswordForm />);

		const oldPasswordInput = screen.getByPlaceholderText(
			"رمز عبور فعلی خود را وارد کنید",
		) as HTMLInputElement;

		expect(oldPasswordInput.type).toBe("password");

		const toggleButtons = screen.getAllByRole("button", {
			name: "نمایش رمز",
		});
		fireEvent.click(toggleButtons[0]);

		expect(oldPasswordInput.type).toBe("text");
	});
});
