import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AvailabilityDialog from "@/components/clinic/AvailabilityDialog";
import { RecurringAvailability } from "@/types";

vi.mock("@/actions/clinic", () => ({
	createRecurringAvailability: vi.fn().mockResolvedValue({ success: true }),
	updateRecurringAvailability: vi.fn().mockResolvedValue({ success: true }),
}));

describe("AvailabilityDialog", () => {
	it("renders create button and title in default create mode", () => {
		render(<AvailabilityDialog mode="create" />);
		expect(
			screen.getByRole("button", { name: "افزودن روز" }),
		).toBeInTheDocument();
	});

	it("renders edit trigger button in edit mode", () => {
		const sampleItem: RecurringAvailability = {
			id: "rec-1",
			dayOfWeek: "1",
			startTime: "09:00:00",
			endTime: "13:00:00",
			priceIrr: "250000",
			durationMinutes: "30",
			appointmentType: "consultation",
			isActive: true,
			validFrom: new Date("2026-01-01"),
			validUntil: undefined,
		};

		render(
			<AvailabilityDialog
				mode="edit"
				availability={sampleItem}
				trigger={<button>ویرایش زمانبندی</button>}
			/>,
		);

		expect(
			screen.getByRole("button", { name: "ویرایش زمانبندی" }),
		).toBeInTheDocument();
	});
});
