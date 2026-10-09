"use client";

import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, use } from "react";

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
	const [slotsError, setSlotsError] = useState(false);
	const [doctorError, setDoctorError] = useState(false);
	const doctorRequest = useRef(0);
	const slotsRequest = useRef(0);

	useEffect(() => {
		void loadDoctorAndSlots();
		return () => { doctorRequest.current += 1; slotsRequest.current += 1; };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resolvedParams.id]);

	const loadSlots = async () => {
		const currentRequest = ++slotsRequest.current;
		setLoadingSlots(true);
		setSlotsError(false);
		setSlots([]);
		try {
			const startDate = format(new Date(), "yyyy-MM-dd");
			const endDate = format(addDays(new Date(), 30), "yyyy-MM-dd");
			const result = await getDoctorAvailability(resolvedParams.id, startDate, endDate);
			if (currentRequest !== slotsRequest.current) return;
			if (result.success) setSlots(result.data.slots);
			else setSlotsError(true);
		} catch {
			if (currentRequest === slotsRequest.current) setSlotsError(true);
		} finally {
			if (currentRequest === slotsRequest.current) setLoadingSlots(false);
		}
	};

	const loadDoctorAndSlots = async () => {
		const currentRequest = ++doctorRequest.current;
		slotsRequest.current += 1;
		setDoctor(null);
		setSlots([]);
		setLoading(true);
		setDoctorError(false);
		try {
			const doctorResult = await getDoctorDetail(resolvedParams.id);
			if (currentRequest !== doctorRequest.current) return;
			if (!doctorResult.success) {
				setDoctorError(true);
				return;
			}
			setDoctor(doctorResult.data);
			await loadSlots();
		} catch {
			if (currentRequest === doctorRequest.current) setDoctorError(true);
		} finally {
			if (currentRequest === doctorRequest.current) setLoading(false);
		}
	};

	const handleBooking = async (bookingData: BookAppointmentRequest) => {
		const result = await bookAppointment(bookingData);
		if (result.success) {
			const paymentUrl = result.data.payment?.paymentUrl;
			if (!paymentUrl || !/^https?:\/\//i.test(paymentUrl)) {
				toast.error("نشانی درگاه پرداخت در پاسخ رزرو معتبر نیست. با پذیرش تماس بگیرید.");
				return;
			}
			toast.success("درحال انتقال به درگاه پرداخت");
			window.location.href = paymentUrl;
		} else {
			toast.error(result.message || "خطا در رزرو نوبت");
		}
	};

	if (loading) return <Skeleton className="h-96 w-full" />;

	if (doctorError)
		return (
			<div role="alert" className="flex flex-col items-center gap-4 p-8 text-center" dir="rtl">
				<p>دریافت اطلاعات پزشک ممکن نشد.</p>
				<Button variant="outline" onClick={() => void loadDoctorAndSlots()}>تلاش دوباره</Button>
			</div>
		);

	if (!doctor)
		return <p className="text-center text-muted-foreground">پزشک یافت نشد</p>;

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
					slotsError={slotsError}
					onRetrySlots={() => void loadSlots()}
				/>
			</div>
		</div>
	);
}
