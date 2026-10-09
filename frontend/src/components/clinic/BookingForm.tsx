"use client";

import { toast } from "sonner";
import { useState } from "react";

import BookingSummary from "./BookingSummary";
import TimeSlotPicker from "./TimeSlotPicker";

import { DoctorProfile, AvailableSlot, BookAppointmentRequest } from "@/types";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Spinner,
	Textarea,
} from "@/components/ui";

interface BookingFormProps {
	doctor: DoctorProfile;
	slots: AvailableSlot[];
	loadingSlots: boolean;
	slotsError?: boolean;
	onRetrySlots?: () => void;
	onBook: (data: BookAppointmentRequest) => Promise<void>;
}

export default function BookingForm({
	doctor,
	slots,
	loadingSlots,
	slotsError = false,
	onRetrySlots,
	onBook,
}: BookingFormProps) {
	const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(
		null,
	);
	const [patientNotes, setPatientNotes] = useState("");
	const [booking, setBooking] = useState(false);
	const activeSlot = selectedSlot && slots.find((slot) =>
		slot.isAvailable && slot.date === selectedSlot.date &&
		slot.startTime === selectedSlot.startTime && slot.endTime === selectedSlot.endTime
	);

	const handleBooking = async () => {
		if (!activeSlot) return toast.error("لطفا یک زمان آزاد انتخاب کنید");
		if (booking || loadingSlots || slotsError || !doctor.isAcceptingPatients) return;
		setBooking(true);
		try {
			await onBook({
				doctorId: doctor.id,
				appointmentDate: activeSlot.date,
				startTime: activeSlot.startTime,
				endTime: activeSlot.endTime,
				appointmentType: "consultation",
				patientNotes,
			});
		} catch {
			toast.error("ارتباط با سرور برای رزرو برقرار نشد. دوباره تلاش کنید.");
		} finally {
			setBooking(false);
		}
	};

	return (
		<Card className="w-full">
			<CardHeader className="flex items-center justify-between gap-4">
				<CardTitle>رزرو نوبت</CardTitle>
				{/* Book Button */}
				<Button
					disabled={
						!activeSlot || booking || loadingSlots || slotsError || !doctor.isAcceptingPatients
					}
					onClick={handleBooking}>
					{booking && <Spinner className="size-4 me-2" />}
					{booking ? "در حال انتقال به درگاه..." : "پرداخت و رزرو"}
				</Button>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				{/* Patient Notes */}
				{activeSlot && !loadingSlots && !slotsError && (
					<div>
						<label htmlFor="booking-patient-notes" className="block text-lg font-semibold mb-2">
							توضیحات (اختیاری)
						</label>
						<Textarea
							id="booking-patient-notes"
							className="min-h-40"
							placeholder="علائم یا مشکلات خود را شرح دهید..."
							value={patientNotes}
							onChange={(e) => setPatientNotes(e.target.value)}
							rows={4}
						/>
					</div>
				)}

				{/* Time Slots */}
				{loadingSlots ? (
					<div role="status" aria-label="در حال دریافت زمان‌های آزاد" className="h-64 bg-muted animate-pulse rounded-md" />
				) : slotsError ? (
					<div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center">
						<p>دریافت زمان‌های آزاد ممکن نشد. دوباره تلاش کنید.</p>
						{onRetrySlots && <Button variant="outline" className="mt-4" onClick={onRetrySlots}>تلاش دوباره</Button>}
					</div>
				) : (
					<div className="overflow-y-auto max-h-80 p-4">
						<TimeSlotPicker
							slots={slots}
							selectedSlot={activeSlot || null}
							onSelectSlot={setSelectedSlot}
						/>
					</div>
				)}

				{/* Booking Summary */}
				{activeSlot && !loadingSlots && !slotsError && <BookingSummary slot={activeSlot} />}
			</CardContent>
		</Card>
	);
}
