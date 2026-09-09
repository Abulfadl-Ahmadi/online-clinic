"use server";

import { apiFetch } from "@/lib/api";
import { clearSession, createSession } from "../token";
import { ApiResult, AuthResult, LoginFormData } from "@/types";

/**
 * Login user with phone number and password
 * @param formData - FormData object containing phone number and password
 * @returns ApiResult<AuthResult>
 */
async function loginWithPasswordAction(
	formData: FormData,
): Promise<ApiResult<AuthResult>> {
	const body = Object.fromEntries(formData) as LoginFormData;

	const response = await apiFetch<AuthResult>("/authentication/login/", {
		method: "POST",
		body: JSON.stringify(body),
	});

	if (!response.success) {
		return {
			...response,
			message: "شماره تلفن / رمز عبور اشتباه است",
		};
	}

	const data = response.data;

	// Save token securely
	await clearSession();
	await createSession(data.access, "acs");
	await createSession(data.refresh, "rfs");

	return {
		data: data,
		success: true,
		message: "ورود موفقیت‌آمیز بود",
	};
}

export default loginWithPasswordAction;
