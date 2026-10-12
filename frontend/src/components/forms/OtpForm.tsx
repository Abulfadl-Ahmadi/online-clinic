"use client";

import { useOtpForm } from "@/hooks";
import { OtpType } from "@/types";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Spinner,
} from "@/components/ui";
import { useEffect, useRef } from "react";

interface OtpFormProps {
	OtpType: OtpType;
	onPhoneVerified?: () => void;
}

function OtpForm(props: OtpFormProps) {
	const { OtpType, onPhoneVerified } = props;

	const {
		form,
		onSubmit,
		loading,
		otpSent,
		sendOtp,
		countdown,
		back,
		phoneVerified,
	} = useOtpForm({ OtpType });

	const otpInputRef = useRef<HTMLInputElement>(null);

	// Auto-focus OTP field when it appears
	useEffect(() => {
		if (otpSent) otpInputRef.current?.focus();
	}, [otpSent]);

	const minutes = Math.floor(countdown / 60);
	const seconds = countdown % 60;

	const handleSendOtp = () => {
		sendOtp(form.getValues("phone_number"));
	};

	useEffect(() => {
		if (phoneVerified) {
			onPhoneVerified?.();
		}
	}, [phoneVerified, onPhoneVerified]);

	return (
		<Form {...form}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit(onSubmit)();
				}}
				className="flex flex-col gap-5"
				dir="rtl">
				{/* Phone number field */}
				<FormField
					control={form.control}
					name="phone_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>شماره موبایل</FormLabel>
							<FormControl>
								<Input
									placeholder="09123456789"
									type="tel"
									inputMode="tel"
									autoComplete="tel"
									className="auth-input"
									{...field}
									dir="ltr"
									disabled={otpSent}
									aria-invalid={!!form.formState.errors.phone_number}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* OTP section */}
				{otpSent && (
					<div className="flex flex-col gap-4">
						{/* Back button */}
						<Button
							variant="ghost"
							type="button"
							onClick={back}
							className="text-sm px-1"
							disabled={loading}>
							ویرایش شماره
						</Button>

						<FormField
							control={form.control}
							name="otp"
							render={({ field }) => (
								<FormItem>
									<FormLabel>کد یکبار مصرف</FormLabel>
									<FormControl>
										<Input
											placeholder="۱۲۳۴۵۶"
											className="auth-input text-center text-xl font-bold tabular-nums"
											type="text"
											inputMode="numeric"
											autoComplete="one-time-code"
											dir="ltr"
											{...field}
											aria-invalid={!!form.formState.errors.otp}
											ref={(e) => {
												field.ref(e);
												otpInputRef.current = e;
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Countdown + resend */}
						<div className="flex items-center justify-between text-sm text-muted-foreground">
							<span>
								زمان باقی‌مانده: {`${minutes}:${seconds.toString().padStart(2, "0")}`.replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])}
							</span>
							<Button
								variant="link"
								size="sm"
								type="button"
								disabled={countdown > 0 || loading}
								onClick={handleSendOtp}>
								ارسال دوباره
							</Button>
						</div>

						{/* Submit OTP */}
						<Button
							type="submit"
							className="auth-submit w-full"
							disabled={loading}>
							{loading && (
								<Spinner className="size-4 me-2" />
							)}
							تأیید کد
						</Button>
					</div>
				)}

				{/* Send OTP button */}
				{!otpSent && (
					<Button
						type="button"
						className="auth-submit w-full"
						onClick={handleSendOtp}
						disabled={loading}>
						{loading && (
							<Spinner className="size-4 me-2" />
						)}
						ارسال کد تأیید
					</Button>
				)}
			</form>
		</Form>
	);
}

export default OtpForm;
