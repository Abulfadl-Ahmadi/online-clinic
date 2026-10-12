"use client";

import Link from "next/link";

import OtpForm from "./OtpForm";
import LoginWithPasswordForm from "./LoginWithPasswordForm";
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/ui";

function LoginForm() {
	return (
		<div className="w-full">
				<Tabs
					defaultValue="password"
					className="w-full">
					<TabsList className="mb-6 grid h-12 w-full grid-cols-2">
						<TabsTrigger value="password">رمز عبور</TabsTrigger>
						<TabsTrigger value="otp">رمز یکبار مصرف</TabsTrigger>
					</TabsList>

					<TabsContent value="password" className="w-full">
						<LoginWithPasswordForm />
					</TabsContent>

					<TabsContent value="otp" className="w-full">
						<OtpForm OtpType="login" />
					</TabsContent>
				</Tabs>
			<div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-[var(--brand-line)] pt-6">
				<Link href="/auth/forgot-password" className="text-primary font-medium hover:underline">رمز عبور را فراموش کرده‌اید؟</Link>
				<p className="text-sm text-muted-foreground">
					حساب کاربری ندارید؟{" "}
					<Link
						href="/auth/register"
						className="text-primary font-medium hover:underline">
						ثبت‌نام
					</Link>
				</p>
			</div>
		</div>
	);
}

export default LoginForm;
