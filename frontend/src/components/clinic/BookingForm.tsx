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
	onBook: (data: BookAppointmentRequest) => Promise<void>;
}

export default function BookingForm({
	doctor,
	slots,
	loadingSlots,
	onBook,
}: BookingFormProps) {
	const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(
		null,
	);
	const [patientNotes, setPatientNotes] = useState("");
	const [booking, setBooking] = useState(false);

	const handleBooking = async () => {
		if (!selectedSlot) return toast.error("لطفا یک نوبت انتخاب کنید");

		setBooking(true);
		await onBook({
			doctorId: doctor.id,
			appointmentDate: selectedSlot.date,
			startTime: selectedSlot.startTime,
			endTime: selectedSlot.endTime,
			appointmentType: "consultation",
			patientNotes,
		});
		setBooking(false);
	};

	return (
		<Card className="w-full">
			<CardHeader className="flex items-center justify-between gap-4">
				<CardTitle>رزرو نوبت</CardTitle>
				{/* Book Button */}
				<Button
					disabled={
						!selectedSlot || booking || !doctor.isAcceptingPatients
					}
					onClick={handleBooking}>
					{booking && <Spinner className="size-4 me-2" />}
					{booking ? "در حال انتقال به درگاه..." : "پرداخت و رزرو"}
				</Button>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				{/* Patient Notes */}
				{selectedSlot && (
					<div>
						<h3 className="text-lg font-semibold mb-2">
							توضیحات (اختیاری)
						</h3>
						<Textarea
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
					<div className="h-64 bg-muted animate-pulse rounded-md" />
				) : (
					<div className="overflow-y-auto max-h-80 p-4">
						<TimeSlotPicker
							slots={slots}
							selectedSlot={selectedSlot}
							onSelectSlot={setSelectedSlot}
						/>
					</div>
				)}

				{/* Booking Summary */}
				{selectedSlot && <BookingSummary slot={selectedSlot} />}
			</CardContent>
		</Card>
	);
}
