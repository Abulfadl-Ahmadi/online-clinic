import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentFailurePage from "@/app/(private)/user/payment/failure/page";
import { useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({ useSearchParams: vi.fn() }));

beforeEach(() => vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("error=processing_failed") as ReturnType<typeof useSearchParams>));

describe("PaymentFailurePage", () => {
	it("does not tell the patient to pay again when verification processing fails", () => {
		render(<PaymentFailurePage />);
		expect(screen.getByRole("heading", { name: "پرداخت تأیید نشده است" })).toBeInTheDocument();
		expect(screen.getByText(/ممکن است نتیجه هنوز مشخص نباشد/)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "مشاهده تراکنش‌ها" })).toHaveAttribute("href", "/user/transactions");
		expect(screen.queryByText(/نوبت شما ثبت نشده است/)).not.toBeInTheDocument();
	});

	it("handles gateway cancellation without claiming the appointment is unregistered", () => {
		vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("status=NOK") as ReturnType<typeof useSearchParams>);
		render(<PaymentFailurePage />);
		expect(screen.getByText(/پرداخت را لغوشده یا ناموفق گزارش کرده/)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "مشاهده نوبت‌های من" })).toHaveAttribute("href", "/user/appointments");
	});
});
