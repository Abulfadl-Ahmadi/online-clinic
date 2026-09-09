"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, Calendar } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
	const searchParams = useSearchParams();
	const [message, setMessage] = useState("پرداخت ناموفق بود");

	useEffect(() => {
		const error = searchParams.get("error");
		const status = searchParams.get("status");

		// Set appropriate error message based on parameters
		if (error === "missing_authority") {
			setMessage("اطلاعات پرداخت نامعتبر است");
		} else if (error === "processing_failed") {
			setMessage("خطا در پردازش پرداخت. لطفاً با پشتیبانی تماس بگیرید");
		} else if (status === "NOK") {
			setMessage("پرداخت توسط کاربر لغو شد یا ناموفق بود");
		} else {
			setMessage("پرداخت ناموفق بود. لطفاً دوباره تلاش کنید");
		}
	}, [searchParams]);

	return (
		<div className="container mx-auto px-4 py-16" dir="rtl">
			<Card className="max-w-lg mx-auto">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<XCircle className="size-16 text-destructive" />
					</div>
					<CardTitle className="text-2xl">
						پرداخت ناموفق
					</CardTitle>
				</CardHeader>

				<CardContent className="text-center flex flex-col gap-6">
					<p className="text-muted-foreground">
						{message}
					</p>

					<p className="text-sm text-muted-foreground">
						نوبت شما ثبت نشده است. لطفاً دوباره تلاش کنید
					</p>

					<div className="flex flex-col gap-3 pt-4">
						<Button asChild className="w-full" size="lg">
							<Link href="/user/doctors">
								<Calendar className="size-4 me-2" />
								تلاش مجدد
							</Link>
						</Button>

						<Button asChild variant="outline" className="w-full" size="lg">
							<Link href="/user/dashboard">
								<Home className="size-4 me-2" />
								بازگشت به داشبورد
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
