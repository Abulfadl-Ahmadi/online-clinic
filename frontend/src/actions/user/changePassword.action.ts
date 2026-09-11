"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "../token";
import { ApiResult, ChangePasswordFormData, ChangePasswordResult } from "@/types";

/**
 * Change password server action for authenticated user
 * @param formData - FormData containing old_password, new_password, confirm_new_password
 * @returns ApiResult<ChangePasswordResult>
 */
async function changePasswordAction(
	formData: FormData,
): Promise<ApiResult<ChangePasswordResult>> {
	const session = await getSession();

	if (!session?.accessToken || !session?.userPayload) {
		return {
			success: false,
			message: "خطای دسترسی - لطفاً ابتدا وارد شوید",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const rawData = Object.fromEntries(formData) as Partial<ChangePasswordFormData>;
	const body = {
		old_password: rawData.old_password,
		new_password: rawData.new_password,
		confirm_new_password: rawData.confirm_new_password,
	};

	const response = await apiFetch<ChangePasswordResult>(
		"/accounts/me/change-password/",
		{
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
		},
		"no-store",
	);

	if (!response.success) {
		if (process.env.NODE_ENV === "development") {
			console.error("[changePasswordAction] Error:", response);
		}
		return {
			success: false,
			message: response.message || "خطا در تغییر رمز عبور",
			statusCode: response.statusCode || 400,
			type: response.type,
		};
	}

	return {
		success: true,
		data: response.data,
		message: response.message || "رمز عبور با موفقیت تغییر یافت",
	};
}

export default changePasswordAction;
