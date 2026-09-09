"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Calendar } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [appointmentId, setAppointmentId] = useState<string | null>(null);

	useEffect(() => {
		const appointmentIdParam = searchParams.get("appointment_id");
		const authority = searchParams.get("authority");
		const status = searchParams.get("status");

		// Check if required parameters are present
		if (!authority || status !== "OK") {
			// If parameters missing or status not OK, redirect to failure
			router.push("/user/payment/failure");
			return;
		}

		// Payment already verified by backend callback
		setAppointmentId(appointmentIdParam);
		setLoading(false);
	}, [searchParams, router]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-16">
				<Card className="max-w-lg mx-auto">
					<CardContent className="p-8">
						<Skeleton className="h-64 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-16" dir="rtl">
			<Card className="max-w-lg mx-auto">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<CheckCircle2 className="size-16 text-success" />
					</div>
					<CardTitle className="text-2xl">
						پرداخت موفق!
					</CardTitle>
				</CardHeader>

				<CardContent className="text-center flex flex-col gap-6">
					<p className="text-muted-foreground">
						نوبت شما با موفقیت رزرو و تایید شد
					</p>

					{appointmentId && (
						<p className="text-sm text-muted-foreground">
							شماره رزرو: {appointmentId}
						</p>
					)}

					<div className="flex flex-col gap-3 pt-4">
						<Button asChild className="w-full" size="lg">
							<Link href="/user/appointments">
								<Calendar className="size-4 me-2" />
								مشاهده نوبت‌های من
							</Link>
						</Button>

						<Button asChild variant="outline" className="w-full" size="lg">
							<Link href="/user/doctors">
								رزرو نوبت جدید
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}