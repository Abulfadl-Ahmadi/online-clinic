"use server";

import { apiFetch } from "@/lib/api";
import {
	ApiResult,
	SpecializationsListResponse,
} from "@/types";

/**
 * Fetch list of all specializations
 * @returns Promise with specialization list or error
 */
async function getSpecializations(): Promise<
	ApiResult<SpecializationsListResponse>
> {
	const url = `/accounts/specializations/`;

	return apiFetch<SpecializationsListResponse>(url, {
		method: "GET",
	});
}

export { getSpecializations };
