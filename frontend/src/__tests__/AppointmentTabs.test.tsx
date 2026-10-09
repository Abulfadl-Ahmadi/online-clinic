import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AppointmentTabs from "@/components/clinic/AppointmentTabs";

vi.mock("@/components/clinic/AppointmentList", () => ({ default: () => <div>فهرست نوبت‌ها</div> }));

const base = { isDoctor: false, upcomingAppointments: [], allAppointments: [], loading: false, onCancel: vi.fn(), page: 1, hasNext: false, hasPrevious: false, onPageChange: vi.fn() };

describe("AppointmentTabs", () => {
	it("shows an upcoming-appointments error and retries", () => {
		const onRetry = vi.fn();
		render(<AppointmentTabs {...base} upcomingError onRetry={onRetry} />);
		expect(screen.getByRole("alert")).toHaveTextContent("دریافت نوبت‌های آینده ممکن نشد");
		fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
		expect(onRetry).toHaveBeenCalledOnce();
	});

	it("shows an all-appointments error without stale pagination", () => {
		render(<AppointmentTabs {...base} allError hasNext />);
		const tab = screen.getByRole("tab", { name: "تمام نوبت‌ها" });
		fireEvent.mouseDown(tab);
		fireEvent.mouseUp(tab);
		fireEvent.click(tab);
		expect(screen.getByRole("alert")).toHaveTextContent("دریافت تمام نوبت‌ها ممکن نشد");
		expect(screen.queryByRole("button", { name: "صفحه بعد" })).not.toBeInTheDocument();
	});
});
