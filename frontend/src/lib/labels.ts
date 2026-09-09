import type { ReactNode } from "react";
import {
	AppointmentStatus,
	AppointmentType,
	TransactionStatus,
} from "@/types";
import { formatDate } from "./utils";

export type BadgeVariant =
	| "default"
	| "secondary"
	| "destructive"
	| "outline"
	| "success"
	| "warning"
	| "info";

/* ==============================
   Appointment Status
   ============================== */
export const APPOINTMENT_STATUS: Record<
	AppointmentStatus,
	{ label: string; variant: BadgeVariant }
> = {
	confirmed: { label: "تایید شده", variant: "success" },
	pending: { label: "در انتظار پرداخت", variant: "warning" },
	cancelled: { label: "لغو شده", variant: "destructive" },
	completed: { label: "انجام شده", variant: "secondary" },
	no_show: { label: "عدم مراجعه", variant: "destructive" },
};

export function getAppointmentStatusText(
	status: AppointmentStatus,
	statusDisplay?: string,
): string {
	// Prefer backend-provided Persian display text
	if (statusDisplay && /[\u0600-\u06FF]/.test(statusDisplay)) {
		return statusDisplay;
	}
	return APPOINTMENT_STATUS[status]?.label ?? "در حال بررسی";
}

export function getAppointmentStatusVariant(
	status: AppointmentStatus,
): BadgeVariant {
	return APPOINTMENT_STATUS[status]?.variant ?? "outline";
}

/* ==============================
   Appointment Type
   ============================== */
export const APPOINTMENT_TYPE: Record<AppointmentType, string> = {
	consultation: "ویزیت حضوری",
	follow_up: "ویزیت تکمیلی",
	emergency: "اورژانسی",
};

export function getAppointmentTypeText(type: AppointmentType): string {
	return APPOINTMENT_TYPE[type] ?? "ویزیت حضوری";
}

/* ==============================
   Payment Status
   ============================== */
const PAYMENT_STATUS: Record<string, { label: string; variant: BadgeVariant }> = {
	succeeded: { label: "موفق", variant: "success" },
	success: { label: "موفق", variant: "success" },
	paid: { label: "پرداخت شده", variant: "success" },
	completed: { label: "پرداخت شده", variant: "success" },
	pending: { label: "در انتظار پرداخت", variant: "warning" },
	unpaid: { label: "در انتظار پرداخت", variant: "warning" },
	processing: { label: "در حال پردازش", variant: "info" },
	failed: { label: "پرداخت ناموفق", variant: "destructive" },
	cancelled: { label: "لغو شده", variant: "destructive" },
	canceled: { label: "لغو شده", variant: "destructive" },
	refunded: { label: "مسترد شده", variant: "secondary" },
	partially_refunded: { label: "استرداد جزئی", variant: "secondary" },
};

export function getPaymentStatus(
	status: string | null,
): { label: string; variant: BadgeVariant } | null {
	if (!status) return null;
	const key = status.toLowerCase().trim();
	if (key in PAYMENT_STATUS) {
		return PAYMENT_STATUS[key];
	}
	if (/[\u0600-\u06FF]/.test(status)) {
		return { label: status, variant: "outline" };
	}
	return null;
}

/* ==============================
   Transaction Status
   ============================== */
export const TRANSACTION_STATUS: Record<
	TransactionStatus,
	{ label: string; variant: BadgeVariant }
> = {
	paid: { label: "موفق", variant: "success" },
	completed: { label: "موفق", variant: "success" },
	pending: { label: "در انتظار پرداخت", variant: "warning" },
	failed: { label: "ناموفق", variant: "destructive" },
	cancelled: { label: "لغو شده", variant: "destructive" },
	refunded: { label: "مسترد شده", variant: "secondary" },
};

const TRANSACTION_STATUS_MAP: Record<
	string,
	{ label: string; variant: BadgeVariant }
> = {
	paid: { label: "موفق", variant: "success" },
	completed: { label: "موفق", variant: "success" },
	succeeded: { label: "موفق", variant: "success" },
	success: { label: "موفق", variant: "success" },
	pending: { label: "در انتظار پرداخت", variant: "warning" },
	processing: { label: "در حال پردازش", variant: "info" },
	failed: { label: "ناموفق", variant: "destructive" },
	cancelled: { label: "لغو شده", variant: "destructive" },
	canceled: { label: "لغو شده", variant: "destructive" },
	refunded: { label: "مسترد شده", variant: "secondary" },
	partially_refunded: { label: "استرداد جزئی", variant: "secondary" },
};

export function getTransactionStatusText(
	status: TransactionStatus | string,
	statusDisplay?: string,
): string {
	// 1. If backend already provided a valid Persian label, use it
	if (statusDisplay && /[\u0600-\u06FF]/.test(statusDisplay)) {
		return statusDisplay;
	}

	// 2. Map English statusDisplay if present
	if (statusDisplay) {
		const matchedByDisplay =
			TRANSACTION_STATUS_MAP[statusDisplay.toLowerCase().trim()];
		if (matchedByDisplay) return matchedByDisplay.label;
	}

	// 3. Map status key
	const key = String(status || "").toLowerCase().trim();
	if (key in TRANSACTION_STATUS_MAP) {
		return TRANSACTION_STATUS_MAP[key].label;
	}

	return TRANSACTION_STATUS[status as TransactionStatus]?.label ?? "نامشخص";
}

export function getTransactionStatusVariant(
	status: TransactionStatus | string,
): BadgeVariant {
	const key = String(status || "").toLowerCase().trim();
	if (key in TRANSACTION_STATUS_MAP) {
		return TRANSACTION_STATUS_MAP[key].variant;
	}
	return TRANSACTION_STATUS[status as TransactionStatus]?.variant ?? "outline";
}

/* ==============================
   Currency & Amount Helpers
   ============================== */
export function formatCurrency(currency?: string | null): string {
	if (!currency) return "ریال";
	const c = currency.trim().toUpperCase();
	if (c === "IRR" || c === "RIAL" || c === "ریال") return "ریال";
	if (c === "IRT" || c === "TOMAN" || c === "تومان") return "تومان";
	if (c === "USD") return "دلار";
	if (c === "EUR") return "یورو";
	return currency;
}

export function formatTransactionAmount(
	amount: number,
	currency?: string | null,
): {
	amountFormatted: string;
	currencyFormatted: string;
	tomanFormatted: string;
	fullDisplay: string;
} {
	const isRial =
		!currency ||
		currency.toUpperCase() === "IRR" ||
		currency.toLowerCase() === "rial" ||
		currency === "ریال";
	const formattedNumber = (amount || 0).toLocaleString("fa-IR");

	if (isRial) {
		const tomanAmount = Math.floor((amount || 0) / 10);
		const tomanFormatted = tomanAmount.toLocaleString("fa-IR");
		return {
			amountFormatted: formattedNumber,
			currencyFormatted: "ریال",
			tomanFormatted,
			fullDisplay: `${formattedNumber} ریال (${tomanFormatted} تومان)`,
		};
	}

	const isToman =
		currency?.toUpperCase() === "IRT" ||
		currency?.toLowerCase() === "toman" ||
		currency === "تومان";
	if (isToman) {
		return {
			amountFormatted: formattedNumber,
			currencyFormatted: "تومان",
			tomanFormatted: formattedNumber,
			fullDisplay: `${formattedNumber} تومان`,
		};
	}

	const curr = formatCurrency(currency);
	return {
		amountFormatted: formattedNumber,
		currencyFormatted: curr,
		tomanFormatted: formattedNumber,
		fullDisplay: `${formattedNumber} ${curr}`,
	};
}

/* ==============================
   Transaction Description Helper
   ============================== */
export function formatTransactionDescription(desc?: string | null): string {
	if (!desc || !desc.trim()) {
		return "پرداخت خدمات کلینیک";
	}

	const text = desc.trim();

	// If already in Persian and not an English template, return as is
	if (/[\u0600-\u06FF]/.test(text) && !/Appointment with Dr/i.test(text)) {
		return text;
	}

	// Match "Appointment with Dr. [Name] on [Date]"
	const appointmentMatch = text.match(
		/(?:Payment for\s+)?Appointment with Dr\.?\s*(.+?)(?:\s+on\s+([\d\-\/]+))?$/i,
	);
	if (appointmentMatch) {
		const doctorName = appointmentMatch[1].trim();
		const dateStr = appointmentMatch[2]?.trim();
		if (dateStr) {
			const formatted = formatDate(dateStr);
			const finalDate = formatted && formatted !== "نامشخص" ? formatted : dateStr;
			return `رزرو نوبت دکتر ${doctorName} در تاریخ ${finalDate}`;
		}
		return `رزرو نوبت دکتر ${doctorName}`;
	}

	// Match other known English patterns
	if (/test payment initiation/i.test(text)) {
		return "شروع پرداخت آزمایشی";
	}
	if (/test payment/i.test(text)) {
		return "پرداخت آزمایشی سیستم";
	}
	if (/online consultation/i.test(text)) {
		return "مشاوره آنلاین پزشکی";
	}
	if (/payment for appointment/i.test(text)) {
		return "پرداخت هزینه نوبت پزشکی";
	}
	if (/appointment/i.test(text)) {
		return "رزرو نوبت پزشکی";
	}

	return text;
}

export type BadgeStatus = { label: string; variant: BadgeVariant };
export type BadgeContent = BadgeStatus & { icon?: ReactNode };