import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DoctorsPage from "@/app/(private)/user/doctors/page";
import { getDoctors } from "@/actions/clinic";
import type { DoctorProfile } from "@/types";

vi.mock("@/actions/clinic", () => ({ getDoctors: vi.fn() }));
vi.mock("@/components/clinic", () => ({ DoctorCard: ({ doctor }: { doctor: DoctorProfile }) => <div>{doctor.fullName}</div> }));

const response = (name: string, next: string | null, previous: string | null) => ({
	success: true as const, message: "موفق", data: { count: 20, next, previous, results: [{ id: name, fullName: name } as DoctorProfile] },
});

describe("DoctorsPage", () => {
	it("ignores a late Strict Mode request after a newer response", async () => {
		let finishFirst!: (value: ReturnType<typeof response>) => void;
		vi.mocked(getDoctors).mockReset().mockImplementationOnce(() => new Promise((resolve) => { finishFirst = resolve; }));
		vi.mocked(getDoctors).mockResolvedValueOnce(response("پزشک تازه", "next", null));
		render(<React.StrictMode><DoctorsPage /></React.StrictMode>);
		await waitFor(() => expect(getDoctors).toHaveBeenCalledTimes(2));
		await waitFor(() => expect(screen.getByText("پزشک تازه")).toBeInTheDocument());
		await act(async () => { finishFirst(response("پزشک قدیمی", null, "previous")); });
		expect(screen.getByText("پزشک تازه")).toBeInTheDocument();
		expect(screen.queryByText("پزشک قدیمی")).not.toBeInTheDocument();
	});

	it("moves to the next page without showing previous page cards", async () => {
		let finishSecond!: (value: ReturnType<typeof response>) => void;
		vi.mocked(getDoctors).mockReset().mockResolvedValueOnce(response("پزشک صفحه اول", "next", null));
		vi.mocked(getDoctors).mockImplementationOnce(() => new Promise((resolve) => { finishSecond = resolve; }));
		render(<DoctorsPage />);
		await waitFor(() => expect(screen.getByText("پزشک صفحه اول")).toBeInTheDocument());
		fireEvent.click(screen.getByRole("button", { name: "صفحه بعد" }));
		await waitFor(() => expect(getDoctors).toHaveBeenCalledWith(2, true));
		expect(screen.queryByText("پزشک صفحه اول")).not.toBeInTheDocument();
		await act(async () => { finishSecond(response("پزشک صفحه دوم", null, "previous")); });
		expect(screen.getByText("پزشک صفحه دوم")).toBeInTheDocument();
		expect(screen.getByText("صفحه 2 از 2")).toBeInTheDocument();
	});
});
