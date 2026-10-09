import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AvailabilityList from "@/components/clinic/AvailabilityList";

vi.mock("@/components/clinic/AvailabilityCard", () => ({ default: () => <div>برنامهٔ پذیرش</div> }));

describe("AvailabilityList", () => {
	it("announces loading without reporting an empty schedule", () => {
		render(<AvailabilityList loading availabilities={undefined} />);
		expect(screen.getByRole("status")).toHaveTextContent("در حال بارگیری");
		expect(screen.queryByText(/هیچ زمان‌بندی/)).not.toBeInTheDocument();
	});

	it("offers retry after a failed fetch", () => {
		const retry = vi.fn();
		render(<AvailabilityList availabilities={null} onRetry={retry} />);
		expect(screen.getByRole("alert")).toHaveTextContent("خطا در دریافت");
		fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
		expect(retry).toHaveBeenCalledOnce();
	});

	it("distinguishes a successful empty response", () => {
		render(<AvailabilityList availabilities={[]} />);
		expect(screen.getByText(/هنوز برنامهٔ پذیرشی تعریف نکرده‌اید/)).toBeInTheDocument();
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});
});
