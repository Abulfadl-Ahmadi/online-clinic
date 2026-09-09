"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "@/actions/token";
import {
	ApiResult,
	AppointmentsListResponse,
	Appointment,
	BookAppointmentRequest,
	BookAppointmentResponse,
	CancelAppointmentRequest,
} from "@/types";

/**
 * Fetch paginated list of user appointments
 * @param page - The page number for pagination (optional, defaults to 1)
 * @returns Promise with paginated appointment list or error
 */
async function getAppointments(
	page: number = 1,
): Promise<ApiResult<AppointmentsListResponse>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "You must be authenticated to access appointments",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `/clinic/appointments/?page=${page}`;

	const result = apiFetch<AppointmentsListResponse>(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return result;
}

/**
 * Fetch upcoming appointments for the current user
 * @returns Promise with upcoming appointments or error
 */
async function getUpcomingAppointments(): Promise<ApiResult<Appointment[]>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "You must be authenticated to access appointments",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `/clinic/appointments/upcoming/`;

	return apiFetch<Appointment[]>(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
}

/**
 * Fetch a specific appointment by ID
 * @param appointmentId - The UUID of the appointment
 * @returns Promise with appointment details or error
 */
async function getAppointmentDetail(
	appointmentId: string,
): Promise<ApiResult<Appointment>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "You must be authenticated to access appointment details",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `/clinic/appointments/${appointmentId}/`;

	const result = apiFetch<Appointment>(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return result;
}

/**
 * Book a new appointment
 * @param bookingData - Appointment booking details
 * @returns Promise with booking response including payment info
 */
async function bookAppointment(
	bookingData: BookAppointmentRequest,
): Promise<ApiResult<BookAppointmentResponse>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "You must be authenticated to book appointments",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `/clinic/appointments/book/`;

	// Convert camelCase to snake_case for backend
	const payload = {
		doctor_id: bookingData.doctorId,
		appointment_date: bookingData.appointmentDate,
		start_time: bookingData.startTime,
		end_time: bookingData.endTime,
		appointment_type: bookingData.appointmentType || "consultation",
		patient_notes: bookingData.patientNotes || "",
	};

	return apiFetch<BookAppointmentResponse>(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(payload),
	});
}

/**
 * Cancel an appointment
 * @param appointmentId - The UUID of the appointment
 * @param cancellationData - Cancellation reason
 * @returns Promise with updated appointment or error
 */
async function cancelAppointment(
	appointmentId: string,
	cancellationData: CancelAppointmentRequest,
): Promise<ApiResult<Appointment>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "You must be authenticated to cancel appointments",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `/clinic/appointments/${appointmentId}/cancel/`;

	return apiFetch<Appointment>(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(cancellationData),
	});
}

export {
	getAppointments,
	getUpcomingAppointments,
	getAppointmentDetail,
	bookAppointment,
	cancelAppointment,
};
