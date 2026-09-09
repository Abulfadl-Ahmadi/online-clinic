"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "../token";
import { ApiResult, User } from "@/types";

async function getUser(): Promise<ApiResult<User>> {
	const session = await getSession();

	if (!session?.accessToken || !session?.userPayload) {
		return {
			success: false,
			message: "خطای دسترسی",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const response = await apiFetch<User>(
		"/accounts/me/",
		{
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
			next: { revalidate: 10 },
		},
		"reload",
	);

	// Let the original error propagate with context
	if (!response.success) {
		return {
			...response,
			message: "خطا در دریافت اطلاعات کاربر",
		};
	}

	return {
		...response,
		message: "اطلاعات با موفقیت دریافت شد",
	};
}

export default getUser;
