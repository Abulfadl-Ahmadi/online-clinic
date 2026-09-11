"use client";

import Link from "next/link";
import { KeyRound, ShieldCheck, ArrowRight } from "lucide-react";
import { useUser } from "@/context";
import { ChangePasswordForm } from "@/components/forms";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui";

function ChangePasswordPage() {
	const { isLoading, isAuthenticated, user } = useUser();

	if ((!isLoading && !isAuthenticated) || !user) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-20" dir="rtl">
				<p className="text-lg font-medium text-muted-foreground">
					برای دسترسی به این صفحه باید ابتدا وارد شوید
				</p>
			</div>
		);
	}

	return (
		<div className="container max-w-xl py-8 flex flex-col gap-6 mx-auto" dir="rtl">
			{/* Breadcrumb / Back link */}
			<div className="flex items-center justify-between">
				<Link href="/user/profile">
					<Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
						<ArrowRight className="size-4" />
						بازگشت به پروفایل
					</Button>
				</Link>
			</div>

			{/* Main Card */}
			<Card className="shadow-sm border-border">
				<CardHeader className="space-y-2">
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-xl bg-primary/10 text-primary">
							<KeyRound className="size-6" />
						</div>
						<div>
							<CardTitle className="text-xl font-bold">تغییر رمز عبور</CardTitle>
							<CardDescription className="text-sm mt-1">
								رمز عبور فعلی و رمز عبور جدید خود را وارد کنید.
							</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent className="pt-2">
					<ChangePasswordForm />

					{/* Security Tips */}
					<div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/60 text-xs text-muted-foreground space-y-2">
						<div className="flex items-center gap-1.5 font-medium text-foreground">
							<ShieldCheck className="size-4 text-primary" />
							نکات امنیتی انتخاب رمز عبور:
						</div>
						<ul className="list-disc list-inside space-y-1 me-2 leading-relaxed">
							<li>طول رمز عبور باید حداقل ۸ کاراکتر باشد.</li>
							<li>رمز عبور جدید نمی‌تواند با رمز عبور فعلی یکسان باشد.</li>
							<li>ترکیب حروف انگلیسی بزرگ و کوچک، ارقام و نمادها توصیه می‌شود.</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default ChangePasswordPage;
