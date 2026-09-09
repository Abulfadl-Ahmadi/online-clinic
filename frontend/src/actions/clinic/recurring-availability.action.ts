"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "@/actions/token";
import {
	ApiResult,
	RecurringAvailability,
	RecurringAvailabilityData,
} from "@/types";

/**
 * Get recurring availability for the current user
 * @returns ApiResult<{ results: RecurringAvailability[] }>
 */
async function getRecurringAvailability(): Promise<
	ApiResult<{ results: RecurringAvailability[] }>
> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "خطا در دریافت وضعیت آمادگی",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `/clinic/recurring-availability/`;

	const result = await apiFetch<{ results: RecurringAvailability[] }>(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!result.success) {
		return {
			success: false,
			message: "خطا در دریافت وضعیت آمادگی",
			statusCode: 400,
			type: "BadRequest",
		};
	}

	return {
		...result,
	};
}

/**
 * Create a new recurring availability
 * @param data - RecurringAvailabilityData object
 * @returns ApiResult<RecurringAvailability>
 */
async function createRecurringAvailability(
	data: RecurringAvailabilityData,
): Promise<ApiResult<RecurringAvailability>> {
	const { accessToken, userPayload } = await getSession();

	if (!accessToken || !userPayload) {
		return {
			success: false,
			message: "خطا در دریافت داده‌های کاربر",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `/clinic/recurring-availability/`;

	const body = {
		doctor: userPayload.id,
		day_of_week: data.dayOfWeek,
		start_time: data.startTime,
		end_time: data.endTime,
		price_irr: data.priceIrr,
		duration_minutes: data.durationMinutes,
		appointment_type: data.appointmentType,
		valid_from: data.validFrom
			? new Date(data.validFrom).toLocaleDateString("en-CA").split("T")[0]
			: null,
		valid_until: data.validUntil
			? new Date(data.validUntil)
					.toLocaleDateString("en-CA")
					.split("T")[0]
			: null,
		is_active: data.isActive,
	};

	const result = await apiFetch<RecurringAvailability>(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(body),
	});

	if (!result.success) {
		return {
			success: false,
			message: "خطا در ارسال وضعیت آمادگی",
			statusCode: 400,
			type: "BadRequest",
		};
	}

	return {
		...result,
	};
}

export { getRecurringAvailability, createRecurringAvailability };
