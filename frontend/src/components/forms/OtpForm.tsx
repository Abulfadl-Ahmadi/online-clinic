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
				className="flex flex-col gap-6"
				dir="rtl">
				{/* Phone number field */}
				<FormField
					control={form.control}
					name="phone_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>شماره تلفن</FormLabel>
							<FormControl>
								<Input
									placeholder="09xxxxxxxxx"
									type="tel"
									{...field}
									disabled={otpSent}
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
											placeholder="123456"
											type="number"
											inputMode="numeric"
											{...field}
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
								زمان باقی‌مانده: {minutes}:
								{seconds.toString().padStart(2, "0")}
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
							className="w-full"
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
						variant="outline"
						className="w-full"
						onClick={handleSendOtp}
						disabled={loading}>
						{loading && (
							<Spinner className="size-4 me-2" />
						)}
						ارسال کد
					</Button>
				)}
			</form>
		</Form>
	);
}

export default OtpForm;
