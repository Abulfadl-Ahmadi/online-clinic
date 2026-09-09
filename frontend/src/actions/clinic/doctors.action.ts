"use server";

import { apiFetch } from "@/lib/api";
// import { getSession } from "@/actions/token";
import { ApiResult, DoctorsListResponse, DoctorProfile } from "@/types";

/**
 * Fetch paginated list of doctors
 * @param page - The page number for pagination (optional, defaults to 1)
 * @param isAcceptingPatients - Filter by accepting patients status
 * @param search - Search query for doctor name/bio
 * @returns Promise with paginated doctor list or error
 */
async function getDoctors(
	page: number = 1,
	isAcceptingPatients?: boolean,
	search?: string,
): Promise<ApiResult<DoctorsListResponse>> {
	let url = `/accounts/doctors/?page=${page}`;

	if (isAcceptingPatients !== undefined) {
		url += `&is_accepting_patients=${isAcceptingPatients}`;
	}

	if (search) {
		url += `&search=${encodeURIComponent(search)}`;
	}

	return apiFetch<DoctorsListResponse>(url, {
		method: "GET",
	});
}

/**
 * Fetch a specific doctor by ID
 * @param doctorId - The UUID of the doctor
 * @returns Promise with doctor details or error
 */
async function getDoctorDetail(
	doctorId: string,
): Promise<ApiResult<DoctorProfile>> {
	const url = `/accounts/doctors/${doctorId}/`;

	const result = await apiFetch<DoctorProfile>(url, {
		method: "GET",
	});

	if (result.success && result.data) {
		// Transform snake_case to camelCase
		const apiData = result.data as DoctorProfile;
		result.data = {
			...result.data,
			isAcceptingPatients: apiData.isAcceptingPatients,
			isVerified: apiData.isVerified,
		};
	}

	return result;
}

export { getDoctors, getDoctorDetail };
