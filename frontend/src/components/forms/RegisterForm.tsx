"use client";

import Link from "next/link";

import OtpForm from "./OtpForm";
import { useRegisterForm } from "@/hooks";
import { useRegisterStore } from "@/lib/stores";
import { StepProgress } from "@/components/common";

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	Spinner,
	Form,
	CardFooter,
} from "@/components/ui";

function RegisterForm() {
	const { phoneVerified, set } = useRegisterStore();
	const {
		form,
		step,
		totalSteps,
		handleNext,
		handleBack,
		onSubmit,
		StepComponent,
	} = useRegisterForm();

	return (
		<Card className="w-full max-w-xs">
			<CardHeader className="flex flex-col items-center justify-center text-center gap-1">
				<CardTitle>ثبت‌نام</CardTitle>
				<CardDescription>
					اطلاعات زیر را برای ثبت‌نام وارد کنید
				</CardDescription>
			</CardHeader>

			{!phoneVerified ? (
				<CardContent>
					<OtpForm
						OtpType="register"
						onPhoneVerified={() => {
							set({ phoneVerified: true });
						}}
					/>
				</CardContent>
			) : (
				<CardContent className="flex flex-col gap-4">
					<StepProgress step={step} totalSteps={totalSteps} />

					<Form {...form}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit(onSubmit)();
							}}
							className="flex flex-col gap-6"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									if (step < totalSteps) {
										handleNext();
									} else if (
										step === totalSteps &&
										form.formState.isValid
									) {
										form.handleSubmit(onSubmit)();
									}
								}
							}}>
							<StepComponent form={form} />
							<div className="flex gap-3">
								{step > 1 && (
									<Button
										type="button"
										variant="outline"
										onClick={handleBack}
										className="flex-1">
										قبلی
									</Button>
								)}
								{step < totalSteps ? (
									<Button
										type="button"
										onClick={handleNext}
										className="flex-1">
										بعدی
									</Button>
								) : (
									<Button
										type="submit"
										className="flex-1"
										disabled={
											form.formState.isSubmitting ||
											!form.formState.isValid
										}>
										{form.formState.isSubmitting ? (
											<Spinner />
										) : (
											"ثبت‌نام"
										)}
									</Button>
								)}
							</div>
						</form>
					</Form>
				</CardContent>
			)}

			<CardFooter className="flex flex-col items-center justify-center">
				<p className="text-sm text-muted-foreground">
					حساب کاربری دارید؟{" "}
					<Link
						href="/auth/login"
						className="text-primary font-medium hover:underline">
						ورود
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}

export default RegisterForm;
