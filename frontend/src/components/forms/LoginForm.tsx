"use client";

import Link from "next/link";

import OtpForm from "./OtpForm";
import LoginWithPasswordForm from "./LoginWithPasswordForm";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	CardDescription,
	CardFooter,
	Button,
} from "@/components/ui";

function LoginForm() {
	return (
		<Card className="w-full max-w-xs shadow-xl">
			<CardHeader className="text-center">
				<CardTitle>ورود</CardTitle>
				<CardDescription>
					جهت ادامه، لطفا اطلاعات زیر را کامل کنید.
				</CardDescription>
			</CardHeader>
			<CardContent className="w-full">
				<Tabs
					defaultValue="password"
					className="items-center justify-center w-full">
					<TabsList className="grid grid-cols-2 mb-6 w-full">
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
			</CardContent>
			<CardFooter className="flex flex-col items-center justify-center">
				<p className="text-sm text-muted-foreground">
					حساب کاربری ندارید؟{" "}
					<Link
						href="/auth/register"
						className="text-primary font-medium hover:underline">
						ثبت‌نام
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}

export default LoginForm;
