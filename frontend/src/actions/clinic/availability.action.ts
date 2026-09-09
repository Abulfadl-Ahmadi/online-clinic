"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "@/actions/token";
import { ApiResult, DoctorAvailabilityResponse } from "@/types";

/**
 * Fetch available slots for a doctor within a date range
 * @param doctorId - The UUID of the doctor
 * @param startDate - Start date (YYYY-MM-DD format)
 * @param endDate - End date (YYYY-MM-DD format, optional)
 * @returns Promise with available slots or error
 */
async function getDoctorAvailability(
	doctorId: string,
	startDate: string,
	endDate?: string,
): Promise<ApiResult<DoctorAvailabilityResponse>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "You must be authenticated to view availability",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	let url = `/clinic/doctor-availability/${doctorId}/slots/?start_date=${startDate}`;

	if (endDate) {
		url += `&end_date=${endDate}`;
	}

	const result = await apiFetch<DoctorAvailabilityResponse>(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!result.success) {
		return {
			success: false,
			message: "خطا در بارگذاری نوبت‌های خالی",
			statusCode: 400,
			type: "BadRequest",
		};
	}

	return {
		...result,
	};
}

export { getDoctorAvailability };
