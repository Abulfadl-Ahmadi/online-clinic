"use client";

import Link from "next/link";

import OtpForm from "./OtpForm";
import { useRegisterForm } from "@/hooks";
import { useRegisterStore } from "@/lib/stores";
import { StepProgress } from "@/components/common";

import {
	Button,
	Spinner,
	Form,
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
		<div className="w-full">

			{!phoneVerified ? (
				<div>
					<OtpForm
						OtpType="register"
						onPhoneVerified={() => {
							set({ phoneVerified: true });
						}}
					/>
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<p className="text-sm font-semibold text-[var(--brand-teal)]">اطلاعات حساب · مرحلهٔ {String(step).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])} از {String(totalSteps).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])}</p>
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
										className="min-h-12 flex-1">
										قبلی
									</Button>
								)}
								{step < totalSteps ? (
									<Button
										type="button"
										onClick={handleNext}
										className="auth-submit flex-1">
										بعدی
									</Button>
								) : (
									<Button
										type="submit"
										className="auth-submit flex-1"
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
				</div>
			)}

			<div className="mt-8 flex flex-col items-center border-t border-[var(--brand-line)] pt-6">
				<p className="text-sm text-muted-foreground">
					حساب کاربری دارید؟{" "}
					<Link
						href="/auth/login"
						className="text-primary font-medium hover:underline">
						ورود
					</Link>
				</p>
			</div>
		</div>
	);
}

export default RegisterForm;
