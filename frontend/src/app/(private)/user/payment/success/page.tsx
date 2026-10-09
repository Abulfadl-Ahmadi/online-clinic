"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAppointmentDetail } from "@/actions/clinic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Calendar, CircleAlert } from "lucide-react";
import Link from "next/link";

type Verification = "loading" | "confirmed" | "unverified";

export default function PaymentSuccessPage() {
	const searchParams = useSearchParams();
	const appointmentId = searchParams.get("appointment_id");
	const authority = searchParams.get("authority");
	const status = searchParams.get("status");
	const [verification, setVerification] = useState<Verification>("loading");

	useEffect(() => {
		let active = true;
		if (!appointmentId || !authority || status !== "OK") return;

		void getAppointmentDetail(appointmentId)
			.then((result) => {
				if (active) setVerification(result.success && result.data.status === "confirmed" ? "confirmed" : "unverified");
			})
			.catch(() => { if (active) setVerification("unverified"); });
		return () => { active = false; };
	}, [appointmentId, authority, status]);

	const confirmed = Boolean(appointmentId && authority && status === "OK" && verification === "confirmed");
	const loading = Boolean(appointmentId && authority && status === "OK" && verification === "loading");

	if (loading) {
		return <div className="container mx-auto px-4 py-16" role="status" aria-label="در حال بررسی وضعیت نوبت">
			<Card className="mx-auto max-w-lg"><CardContent className="p-8"><Skeleton className="h-64 w-full" /></CardContent></Card>
		</div>;
	}

	return (
		<div className="container mx-auto px-4 py-16" dir="rtl">
			<Card className="max-w-lg mx-auto">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						{confirmed ? <CheckCircle2 aria-hidden="true" className="size-16 text-success" /> : <CircleAlert aria-hidden="true" className="size-16 text-muted-foreground" />}
					</div>
					<CardTitle className="text-2xl"><h1>{confirmed ? "نوبت تأیید شد" : "وضعیت پرداخت تأیید نشده است"}</h1></CardTitle>
				</CardHeader>
				<CardContent className="text-center flex flex-col gap-6">
					<p className="text-muted-foreground">
						{confirmed ? "وضعیت نوبت شما در سامانه تأیید شده است." : "تأیید نوبت از سامانه ممکن نشد. پیش از پرداخت دوباره، وضعیت نوبت‌ها و تراکنش‌های خود را بررسی کنید یا با پذیرش تماس بگیرید."}
					</p>
					{confirmed && <p className="text-sm text-muted-foreground">شماره رزرو: {appointmentId}</p>}
					<div className="flex flex-col gap-3 pt-4">
						<Button asChild className="w-full" size="lg"><Link href="/user/appointments"><Calendar className="size-4 me-2" />مشاهده نوبت‌های من</Link></Button>
						<Button asChild variant="outline" className="w-full" size="lg"><Link href="/user/transactions">مشاهده تراکنش‌ها</Link></Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
