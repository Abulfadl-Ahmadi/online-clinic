"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { OtpType, VerifyOtpFormData } from "@/types";
import { VerifyOtpSchema } from "@/lib/validations";
import { sendOtpAction, verifyOtpAction } from "@/actions";

interface OtpProps {
	OtpType: OtpType;
}

function useOtpForm(props: OtpProps) {
	const { OtpType } = props;

	// Router
	const searchParams = useSearchParams();
	const next = searchParams.get("next");

	const [otpSent, setOtpSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const [countdown, setCountdown] = useState(0); // countdown in seconds
	const [phoneVerified, setPhoneVerified] = useState(false);

	const form = useForm<VerifyOtpFormData>({
		resolver: zodResolver(VerifyOtpSchema),
		defaultValues: { phone_number: "", otp: "" },
	});

	// countdown timer effect
	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
		return () => clearInterval(timer);
	}, [countdown]);

	// step 1: send OTP
	async function sendOtp(phone_number: string) {
		setLoading(true);
		try {
			const isValid = await form.trigger("phone_number");
			if (!isValid) return;

			const formData = new FormData();
			formData.append("phone_number", phone_number);

			const result = await sendOtpAction(formData, OtpType);

			if (result.success) {
				toast.success(result.message);
				setOtpSent(true);
				setCountdown(90); // start 1:30 countdown
			} else {
				toast.error(result.message);
			}
		} catch (err: unknown) {
			console.error("[useOtpForm sendOtp]", err);
			toast.error("خطای غیرمنتظره");
		} finally {
			setLoading(false);
		}
	}

	// step 2: verify OTP
	async function onSubmit(values: VerifyOtpFormData) {
		if (!otpSent) return;

		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("phone_number", values.phone_number);
			formData.append("code", values.otp);
			const result = await verifyOtpAction(formData, OtpType);

			if (result.success) {
				form.reset();
				setPhoneVerified(true);
				setOtpSent(false);
				setCountdown(0);
				toast.success(result.message);
				// Redirect to next param or default to /dashboard
				if (OtpType === "login") {
					const redirectTo = next ?? "/user/dashboard";
					window.location.href = redirectTo;
				}
			} else {
				toast.error(result.message);
				setPhoneVerified(false);
			}
		} catch (err: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("[useOtpForm onSubmit]", err);
			}

			toast.error("خطای غیرمنتظره");
			setPhoneVerified(false);
		} finally {
			setLoading(false);
		}
	}

	function back() {
		setOtpSent(false);
		setCountdown(0);
		form.reset({ otp: "" });
	}

	return {
		form,
		onSubmit,
		loading,
		otpSent,
		sendOtp,
		countdown,
		back,
		phoneVerified,
	};
}

export default useOtpForm;
