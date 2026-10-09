import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DoctorDetailPage from "@/app/(private)/user/doctors/[id]/page";
import { getDoctorDetail, getDoctorAvailability } from "@/actions/clinic";
import type { DoctorProfile } from "@/types";

vi.mock("next/navigation", () => ({ useRouter: () => ({ back: vi.fn() }) }));
vi.mock("@/actions/clinic", () => ({ getDoctorDetail: vi.fn(), getDoctorAvailability: vi.fn(), bookAppointment: vi.fn() }));
vi.mock("@/components/clinic/DoctorInfo", () => ({ default: ({ doctor }: { doctor: DoctorProfile }) => <div>{doctor.fullName}</div> }));
vi.mock("@/components/clinic/BookingForm", () => ({ default: () => <div>فرم رزرو</div> }));

const detail = (name: string) => ({ success: true as const, message: "موفق", data: { id: name, fullName: name } as DoctorProfile });
const availability = { success: true as const, message: "موفق", data: { doctorId: "doctor-id", doctorName: "پزشک تازه", startDate: "2026-10-01", endDate: "2026-10-31", slots: [] } };

describe("DoctorDetailPage", () => {
	it("ignores a delayed detail request from the previous effect", async () => {
		let finishOld!: (value: ReturnType<typeof detail>) => void;
		vi.mocked(getDoctorDetail).mockReset().mockImplementationOnce(() => new Promise((resolve) => { finishOld = resolve; }));
		vi.mocked(getDoctorDetail).mockResolvedValueOnce(detail("پزشک تازه"));
		vi.mocked(getDoctorAvailability).mockReset().mockResolvedValue(availability as Awaited<ReturnType<typeof getDoctorAvailability>>);
		await act(async () => { render(<React.StrictMode><DoctorDetailPage params={Promise.resolve({ id: "doctor-id" })} /></React.StrictMode>); });
		await waitFor(() => expect(screen.getByText("پزشک تازه")).toBeInTheDocument());
		await act(async () => { finishOld(detail("پزشک قدیمی")); });
		expect(screen.getByText("پزشک تازه")).toBeInTheDocument();
		expect(screen.queryByText("پزشک قدیمی")).not.toBeInTheDocument();
	});
});
