"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleAlert, Calendar, ListChecks } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");
	const status = searchParams.get("status");
	const message = error === "missing_authority"
		? "اطلاعات بازگشت از درگاه کامل نیست. وضعیت پرداخت را از بخش تراکنش‌ها بررسی کنید."
		: error === "processing_failed"
			? "در بررسی پرداخت خطایی رخ داده است. ممکن است نتیجه هنوز مشخص نباشد؛ پیش از پرداخت دوباره، وضعیت نوبت و تراکنش را بررسی کنید."
			: status === "NOK"
				? "درگاه، پرداخت را لغوشده یا ناموفق گزارش کرده است. وضعیت نوبت و تراکنش را بررسی کنید."
				: "تأیید پرداخت در این بازگشت ممکن نشد. وضعیت نوبت و تراکنش را بررسی کنید.";

	return (
		<div className="container mx-auto px-4 py-16" dir="rtl">
			<Card className="max-w-lg mx-auto">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4"><CircleAlert aria-hidden="true" className="size-16 text-destructive" /></div>
					<CardTitle className="text-2xl"><h1>پرداخت تأیید نشده است</h1></CardTitle>
				</CardHeader>
				<CardContent className="text-center flex flex-col gap-6">
					<p className="text-muted-foreground">{message}</p>
					<p className="text-sm text-muted-foreground">این صفحه به‌تنهایی وضعیت نهایی نوبت یا برداشت وجه را تعیین نمی‌کند. اگر وجهی از حساب شما کسر شده است، پیش از رزرو دوباره با پذیرش هماهنگ کنید.</p>
					<div className="flex flex-col gap-3 pt-4">
						<Button asChild className="w-full" size="lg"><Link href="/user/transactions"><ListChecks className="size-4 me-2" />مشاهده تراکنش‌ها</Link></Button>
						<Button asChild variant="outline" className="w-full" size="lg"><Link href="/user/appointments"><Calendar className="size-4 me-2" />مشاهده نوبت‌های من</Link></Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
