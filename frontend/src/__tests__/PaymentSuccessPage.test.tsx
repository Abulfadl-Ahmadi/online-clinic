import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentSuccessPage from "@/app/(private)/user/payment/success/page";
import { getAppointmentDetail } from "@/actions/clinic";
import type { Appointment } from "@/types";

const params = new URLSearchParams("appointment_id=booking-1&authority=authority-1&status=OK");
vi.mock("next/navigation", () => ({ useSearchParams: vi.fn() }));
vi.mock("@/actions/clinic", () => ({ getAppointmentDetail: vi.fn() }));
import { useSearchParams } from "next/navigation";

beforeEach(() => {
	vi.mocked(useSearchParams).mockReturnValue(params as ReturnType<typeof useSearchParams>);
	vi.mocked(getAppointmentDetail).mockReset();
});

describe("PaymentSuccessPage", () => {
	it("does not claim success when the appointment is not confirmed", async () => {
		vi.mocked(getAppointmentDetail).mockResolvedValue({ success: true, message: "موفق", data: { status: "pending" } as Appointment });
		render(<PaymentSuccessPage />);
		await waitFor(() => expect(screen.getByRole("heading", { name: "وضعیت پرداخت تأیید نشده است" })).toBeInTheDocument());
		expect(screen.queryByText("شماره رزرو: booking-1")).not.toBeInTheDocument();
	});

	it("confirms only after the appointment API reports confirmed", async () => {
		vi.mocked(getAppointmentDetail).mockResolvedValue({ success: true, message: "موفق", data: { status: "confirmed" } as Appointment });
		render(<PaymentSuccessPage />);
		await waitFor(() => expect(screen.getByRole("heading", { name: "نوبت تأیید شد" })).toBeInTheDocument());
		expect(getAppointmentDetail).toHaveBeenCalledWith("booking-1");
		expect(screen.getByText("شماره رزرو: booking-1")).toBeInTheDocument();
	});

	it("rejects success links without required callback parameters", () => {
		vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("status=OK") as ReturnType<typeof useSearchParams>);
		render(<PaymentSuccessPage />);
		expect(screen.getByRole("heading", { name: "وضعیت پرداخت تأیید نشده است" })).toBeInTheDocument();
		expect(getAppointmentDetail).not.toHaveBeenCalled();
	});
});
