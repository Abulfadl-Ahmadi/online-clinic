"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "../token";
import { ApiResult, RegisterFormData, RegisterResult } from "@/types";

/**
 * Register user action
 * @param data - RegisterInputData object containing user data
 * @returns ApiResult<RegisterResult>
 */
async function registerAction(
	formData: FormData,
): Promise<ApiResult<RegisterResult>> {
	const session = await getSession();

	if (!session?.accessToken || !session?.userPayload) {
		return {
			success: false,
			message: "خطای دسترسی",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const body = Object.fromEntries(formData) as RegisterFormData;

	const response = await apiFetch<RegisterResult>(
		"/authentication/register/",
		{
			method: "PATCH",
			body: JSON.stringify(body),
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
		},
		"no-store",
	);

	if (!response.success) {
		// Optional logging
		if (process.env.NODE_ENV === "development") {
			console.error("[registerAction]", response);
		}
		return {
			success: false,
			message: "خطا در ثبت نام",
			statusCode: 400,
			type: "BadRequest",
		};
	}

	const data = response.data;

	return {
		success: true,
		data: data,
		message: "ثبت نام موفقیت‌آمیز بود",
	};
}

export default registerAction;
