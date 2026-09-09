"use server";

import { apiFetch } from "@/lib/api";
import {
	ApiResult,
	AppointmentPaymentVerification,
} from "@/types";

/**
 * Verify payment and confirm appointment (called from payment callback)
 * @param authority - Payment authority code from ZarinPal
 * @param status - Payment status from ZarinPal
 * @returns Promise with verification result
 */
async function verifyAppointmentPayment(
	authority: string,
	status: string,
): Promise<ApiResult<AppointmentPaymentVerification>> {
	const url = `/finance/payments/callback/?Authority=${authority}&Status=${status}`;

	return apiFetch<AppointmentPaymentVerification>(url, {
		method: "GET",
	});
}

export { verifyAppointmentPayment };
