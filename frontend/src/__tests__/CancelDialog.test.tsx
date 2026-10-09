import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CancelDialog from "@/components/clinic/CancelDialog";

describe("CancelDialog", () => {
	it("labels the optional cancellation reason and confirms once", () => {
		const onConfirm = vi.fn();
		const setCancelReason = vi.fn();
		render(<CancelDialog open onOpenChange={vi.fn()} cancelReason="" setCancelReason={setCancelReason} onConfirm={onConfirm} cancelling={false} />);
		fireEvent.change(screen.getByRole("textbox", { name: "دلیل لغو نوبت (اختیاری)" }), { target: { value: "تغییر برنامه" } });
		expect(setCancelReason).toHaveBeenCalledWith("تغییر برنامه");
		fireEvent.click(screen.getByRole("button", { name: "لغو نوبت" }));
		expect(onConfirm).toHaveBeenCalledOnce();
	});

	it("blocks duplicate confirmation while cancellation is pending", () => {
		const onConfirm = vi.fn();
		render(<CancelDialog open onOpenChange={vi.fn()} cancelReason="" setCancelReason={vi.fn()} onConfirm={onConfirm} cancelling />);
		expect(screen.getByRole("button", { name: /در حال لغو/ })).toBeDisabled();
		expect(onConfirm).not.toHaveBeenCalled();
	});
});
