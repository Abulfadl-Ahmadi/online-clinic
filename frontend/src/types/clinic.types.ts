import z from "zod";
import { RecurringAvailabilitySchema } from "@/lib/validations";

/** ================================
 *  Specialization Types
 *  ================================ */

export interface Specialization {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

/** ================================
 *  Doctor Types
 *  ================================ */

export interface DoctorProfile {
	id: string;
	phoneNumber: string;
	fullName: string;
	medicalLicenseNumber: string;
	specializations: Specialization[];
	bio: string;
	yearsOfExperience: number;
	defaultConsultationDuration: number;
	defaultPriceIrr: string;
	isAcceptingPatients: boolean;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
}

/** ================================
 *  Appointment Status & Types
 *  ================================ */

export const AppointmentStatus = {
	pending: "pending",
	confirmed: "confirmed",
	cancelled: "cancelled",
	completed: "completed",
	no_show: "no_show",
} as const;

export type AppointmentStatus =
	(typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const AppointmentType = {
	consultation: "consultation",
	follow_up: "follow_up",
	emergency: "emergency",
} as const;

export type AppointmentType =
	(typeof AppointmentType)[keyof typeof AppointmentType];

/** ================================
 *  Appointment Types
 *  ================================ */

export interface Appointment {
	id: string;
	doctor: string;
	doctorName: string;
	patient: string;
	patientPhone: string;
	appointmentDate: string;
	startTime: string;
	endTime: string;
	appointmentType: AppointmentType;
	appointmentTypeDisplay: string;
	priceIrr: string;
	status: AppointmentStatus;
	statusDisplay: string;
	patientNotes: string;
	doctorNotes: string;
	cancellationReason: string;
	isUpcoming: boolean;
	paymentStatus: string | null;
	paymentId: string | null;
	createdAt: string;
	updatedAt: string;
	confirmedAt: string | null;
	cancelledAt: string | null;
}

/** ================================
 *  Available Slot Types
 *  ================================ */

export interface AvailableSlot {
	date: string;
	startTime: string;
	endTime: string;
	priceIrr: string;
	durationMinutes: number;
	appointmentType: string;
	isAvailable: boolean;
}

export interface DoctorAvailabilityResponse {
	doctorId: string;
	doctorName: string;
	startDate: string;
	endDate: string;
	slots: AvailableSlot[];
}

/** ================================
 *  Booking Request/Response
 *  ================================ */

export interface BookAppointmentRequest {
	doctorId: string;
	appointmentDate: string;
	startTime: string;
	endTime: string;
	appointmentType?: AppointmentType;
	patientNotes?: string;
}

export interface PaymentInfo {
	id: string;
	transactionId: string; // Backend uses snake_case
	authority: string;
	paymentUrl: string; // Backend uses snake_case
	amountIrr: string; // Backend uses snake_case
	status: string;
}

export interface BookAppointmentResponse {
	appointment: Appointment;
	payment: PaymentInfo;
}

/** ================================
 *  Appointment Cancellation
 *  ================================ */

export interface CancelAppointmentRequest {
	reason?: string;
}

/** ================================
 *  List Responses (using PaginatedResponse from finance.types)
 *  ================================ */

// PaginatedResponse is imported from finance.types to avoid duplication
// Import it in your code like: import { PaginatedResponse } from "@/types";

export type DoctorsListResponse = {
	count: number;
	next: string | null;
	previous: string | null;
	results: DoctorProfile[];
};

export type AppointmentsListResponse = {
	count: number;
	next: string | null;
	previous: string | null;
	results: Appointment[];
};

export type SpecializationsListResponse = {
	count: number;
	next: string | null;
	previous: string | null;
	results: Specialization[];
};

/** ================================
 *  Payment Verification for Appointments
 *  ================================ */

export interface AppointmentPaymentVerification {
	status: "success" | "failed";
	appointmentId?: string;
	message: string;
	redirectUrl: string;
}

export type RecurringAvailability = {
	id: string;
} & z.infer<typeof RecurringAvailabilitySchema>;

export type RecurringAvailabilityData = z.infer<
	typeof RecurringAvailabilitySchema
>;

export const DAYS_OF_WEEK = [
	{ value: "1", label: "دوشنبه" },
	{ value: "2", label: "سه‌شنبه" },
	{ value: "3", label: "چهارشنبه" },
	{ value: "4", label: "پنج‌شنبه" },
	{ value: "5", label: "جمعه" },
	{ value: "6", label: "شنبه" },
	{ value: "7", label: "یک‌شنبه" },
];

export const APPOINTMENT_TYPES = [
	{ value: "consultation", label: "ویزیت حضوری" },
	{ value: "follow_up", label: "ویزیت تکمیلی" },
	{ value: "emergency", label: "اورژانسی" },
];
