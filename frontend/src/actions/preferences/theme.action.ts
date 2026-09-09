"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "../token";
import { ApiResult, SettingsResult, ThemeType } from "@/types";

/**
 * Set theme to user's preferences
 * @param theme - ThemeType object containing theme and language
 * @returns ApiResult<ThemeType>
 */
async function setThemeAction(
	theme: ThemeType,
): Promise<ApiResult<SettingsResult>> {
	const { accessToken, userPayload } = await getSession();

	if (!accessToken || !userPayload) {
		return {
			success: false,
			message: "خطای دسترسی",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const response = await apiFetch<SettingsResult>("/accounts/me/settings/", {
		method: "PATCH",
		body: JSON.stringify({
			theme: theme,
		}),
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.success) {
		return {
			success: false,
			message: "خطا در تنظیم تم",
			statusCode: 400,
			type: "BadRequest",
		};
	}

	const data = response.data;

	return {
		success: true,
		data: data,
		message: "تم تنظیم شد",
	};
}

export default setThemeAction;
