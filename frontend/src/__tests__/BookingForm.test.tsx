import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BookingForm from "@/components/clinic/BookingForm";
import { toast } from "sonner";
import type { AvailableSlot, DoctorProfile } from "@/types";

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));
vi.mock("@/components/clinic/TimeSlotPicker", () => ({ default: ({ onSelectSlot }: { onSelectSlot: (slot: AvailableSlot) => void }) => <button onClick={() => onSelectSlot({ date: "2026-10-10", startTime: "10:00", endTime: "10:30", isAvailable: true } as AvailableSlot)}>انتخاب زمان</button> }));
vi.mock("@/components/clinic/BookingSummary", () => ({ default: () => <div>خلاصه رزرو</div> }));

const doctor = { id: "doctor-1", isAcceptingPatients: true } as DoctorProfile;
const slot = { date: "2026-10-10", startTime: "10:00", endTime: "10:30", isAvailable: true } as AvailableSlot;

describe("BookingForm", () => {
	it("shows a retryable slot error rather than an empty schedule", () => {
		const onRetrySlots = vi.fn();
		render(<BookingForm doctor={doctor} slots={[]} loadingSlots={false} slotsError onRetrySlots={onRetrySlots} onBook={vi.fn()} />);
		expect(screen.getByRole("alert")).toHaveTextContent("دریافت زمان‌های آزاد ممکن نشد");
		expect(screen.getByRole("button", { name: "پرداخت و رزرو" })).toBeDisabled();
		fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
		expect(onRetrySlots).toHaveBeenCalledOnce();
	});

	it("blocks a selected slot removed by a refreshed schedule", () => {
		const onBook = vi.fn();
		const { rerender } = render(<BookingForm doctor={doctor} slots={[slot]} loadingSlots={false} onBook={onBook} />);
		fireEvent.click(screen.getByRole("button", { name: "انتخاب زمان" }));
		rerender(<BookingForm doctor={doctor} slots={[]} loadingSlots={false} onBook={onBook} />);
		expect(screen.getByRole("button", { name: "پرداخت و رزرو" })).toBeDisabled();
		expect(screen.queryByText("خلاصه رزرو")).not.toBeInTheDocument();
		expect(onBook).not.toHaveBeenCalled();
	});

	it("does not offer a slot after it becomes unavailable", () => {
		const onBook = vi.fn();
		const { rerender } = render(<BookingForm doctor={doctor} slots={[slot]} loadingSlots={false} onBook={onBook} />);
		fireEvent.click(screen.getByRole("button", { name: "انتخاب زمان" }));
		rerender(<BookingForm doctor={doctor} slots={[{ ...slot, isAvailable: false }]} loadingSlots={false} onBook={onBook} />);
		expect(screen.getByRole("button", { name: "پرداخت و رزرو" })).toBeDisabled();
		expect(screen.queryByText("خلاصه رزرو")).not.toBeInTheDocument();
		expect(onBook).not.toHaveBeenCalled();
	});

	it("releases the booking button when submission rejects", async () => {
		const onBook = vi.fn().mockRejectedValue(new Error("Offline"));
		render(<BookingForm doctor={doctor} slots={[slot]} loadingSlots={false} onBook={onBook} />);
		fireEvent.click(screen.getByRole("button", { name: "انتخاب زمان" }));
		expect(screen.getByRole("textbox", { name: "توضیحات (اختیاری)" })).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "پرداخت و رزرو" }));
		await waitFor(() => expect(screen.getByRole("button", { name: "پرداخت و رزرو" })).toBeEnabled());
		expect(onBook).toHaveBeenCalledOnce();
		expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("دوباره تلاش کنید"));
	});
});
