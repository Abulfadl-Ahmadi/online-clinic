"use client";

import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";

import { Button, Skeleton } from "@/components/ui";
import { DoctorProfile, AvailableSlot, BookAppointmentRequest } from "@/types";
import {
	getDoctorDetail,
	getDoctorAvailability,
	bookAppointment,
} from "@/actions/clinic";
import DoctorInfo from "@/components/clinic/DoctorInfo";
import BookingForm from "@/components/clinic/BookingForm";

export default function DoctorDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = use(params);
	const router = useRouter();

	const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
	const [slots, setSlots] = useState<AvailableSlot[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingSlots, setLoadingSlots] = useState(false);

	useEffect(() => {
		loadDoctorAndSlots();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resolvedParams.id]);

	const loadDoctorAndSlots = async () => {
		setLoading(true);

		const doctorResult = await getDoctorDetail(resolvedParams.id);
		if (!doctorResult.success) {
			toast.error("خطا در بارگذاری اطلاعات پزشک");
			return router.push("/user/doctors");
		}
		setDoctor(doctorResult.data);

		setLoadingSlots(true);
		const startDate = format(new Date(), "yyyy-MM-dd");
		const endDate = format(addDays(new Date(), 30), "yyyy-MM-dd");

		const slotsResult = await getDoctorAvailability(
			resolvedParams.id,
			startDate,
			endDate,
		);

		if (!slotsResult.success) toast.error("خطا در بارگذاری نوبت‌های خالی");
		else {
			setSlots(slotsResult.data.slots);
		}

		setLoadingSlots(false);
		setLoading(false);
	};

	const handleBooking = async (bookingData: BookAppointmentRequest) => {
		const result = await bookAppointment(bookingData);
		if (result.success) {
			toast.success("درحال انتقال به درگاه پرداخت");
			if (result.data.payment) {
				window.location.href = result.data.payment.paymentUrl;
			}
		} else {
			toast.error(result.message || "خطا در رزرو نوبت");
		}
	};

	if (loading) return <Skeleton className="h-96 w-full" />;

	if (!doctor)
		return (
			<p className="text-center text-muted-foreground">پزشک یافت نشد</p>
		);

	return (
		<div className="container mx-auto px-4 py-8 flex flex-col gap-6" dir="rtl">
			<Button variant="ghost" onClick={() => router.back()} className="w-fit">
				<ArrowRight className="size-4 me-2" />
				بازگشت
			</Button>

			<div className="flex flex-col items-center justify-center gap-4">
				<DoctorInfo doctor={doctor} />
				<BookingForm
					doctor={doctor}
					slots={slots}
					onBook={handleBooking}
					loadingSlots={loadingSlots}
				/>
			</div>
		</div>
	);
}
