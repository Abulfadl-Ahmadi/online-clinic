"use server";

import { apiFetch } from "@/lib/api";
import { clearSession, createSession } from "../token";
import {
	ApiResult,
	SendOtpFormData,
	SendOtpResult,
	VerifyOtpFormData,
	AuthResult,
	OtpType,
} from "@/types";

/**
 * Send OTP to user's phone number
 * @param formData - FormData object containing phone number
 * @param otpType - Optional OTP type (e.g. "login" | "register" | "reset_password")
 * @returns ApiResult<SendOtpResult>
 */
async function sendOtpAction(
	formData: FormData,
	otpType: OtpType = "login",
): Promise<ApiResult<SendOtpResult>> {
	const body = Object.fromEntries(formData) as SendOtpFormData;

	const url = `/authentication/send-otp/?type=${encodeURIComponent(otpType)}`;

	const response = await apiFetch<SendOtpResult>(url, {
		method: "POST",
		body: JSON.stringify(body),
	});

	if (!response.success) {
		if (response.statusCode === 409) {
			return {
				success: false,
				message: "این شماره قبلا ثبت نام شده است",
				statusCode: 409,
				type: "Conflict",
			};
		}
		return {
			success: false,
			message: "خطا در ارسال کد",
			statusCode: 400,
			type: "BadRequest",
		};
	}

	const data = response.data;

	return {
		success: true,
		data: data,
		message: `کد به شماره تلفن ${body.phone_number} ارسال شد`,
	};
}

/**
 * Verify OTP code sent to user's phone number
 * @param formData - FormData object containing phone number and OTP code
 * @param otpType - Optional OTP type (e.g. "login" | "register" | "reset_password")
 * @returns ApiResult<AuthResult>
 */
async function verifyOtpAction(
	formData: FormData,
	otpType: OtpType = "login",
): Promise<ApiResult<AuthResult>> {
	const body = Object.fromEntries(formData) as VerifyOtpFormData;

	const url = `/authentication/verify-otp/?type=${encodeURIComponent(
		otpType,
	)}`;

	const response = await apiFetch<AuthResult>(url, {
		method: "POST",
		body: JSON.stringify(body),
	});

	if (!response.success) {
		return {
			success: false,
			message: "کد وارد شده معتبر نمی باشد",
			statusCode: 400,
			type: "BadRequest",
		};
	}

	const data = response.data;

	// Save token securely
	await clearSession();
	await createSession(data.access, "acs");
	await createSession(data.refresh, "rfs");

	return {
		success: true,
		data: data,
		message: "شماره تلفن شما با موفقیت تأیید شد",
	};
}

export { sendOtpAction, verifyOtpAction };
