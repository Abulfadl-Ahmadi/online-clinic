import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { isValid, parseISO } from "date-fns";
import packageJson from "../../../package.json";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Get the current application version.
 * @returns The current application version.
 */
export function getAppVersion() {
	return packageJson.version || "0.1.0";
}

/**
 * Check if the current path is active for the given link
 * @param currentPath - The current path
 * @param linkPath - The path of the link
 * @returns true if the current path is active for the given link, false otherwise
 */
export function isLinkActive(currentPath: string, linkPath: string): boolean {
	const result: boolean =
		currentPath === linkPath ||
		(linkPath !== "/admin" && currentPath === `${linkPath}/`);

	return result;
}

export function formatDate(dateString?: string | null) {
	if (!dateString) return "نامشخص";
	try {
		return new Intl.DateTimeFormat("fa-IR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(parseISO(dateString));
	} catch (error) {
		console.error("Error formatting date:", error);
		return "نامشخص";
	}
}

export function genderLabel(gender: string) {
	switch (gender) {
		case "male":
			return "مرد";
		case "female":
			return "زن";
		default:
			return "سایر";
	}
}

export function themeLabel(theme: string) {
	switch (theme) {
		case "light":
			return "روشن";
		case "dark":
			return "تاریک";
		default:
			return "سیستم";
	}
}

export function languageLabel(lang: string) {
	switch (lang) {
		case "fa":
			return "فارسی";
		case "en":
			return "انگلیسی";
		default:
			return lang;
	}
}

/**
 * Formats a price to a string with a thousands separator.
 * @param priceIrr - The price in IRR (Iranian Rial) format.
 * @returns The formatted price string.
 */
export function formatPriceToman(priceIrr: string): string {
	return new Intl.NumberFormat("fa-IR").format(
		Math.floor(parseInt(priceIrr) / 10),
	);
}

/**
 * Converts a date string to a Date object in Tehran timezone.
 */
function toTehranDate(dateString: string): Date | null {
	try {
		const date = parseISO(dateString);
		if (!isValid(date)) return null;

		// Force conversion to Asia/Tehran timezone
		return new Date(
			date.toLocaleString("en-US", { timeZone: "Asia/Tehran" }),
		);
	} catch {
		return null;
	}
}

/**
 * Format full date + time in Persian locale (without seconds)
 * Example: "۲۰ آبان ۱۴۰۴ - ۲۱:۳۰"
 */
export function formatDateTime(dateString?: string | null): string {
	if (!dateString) return "نامشخص";

	const date = toTehranDate(dateString);
	if (!date) return "نامشخص";

	try {
		const formattedDate = new Intl.DateTimeFormat("fa-IR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);

		const formattedTime = new Intl.DateTimeFormat("fa-IR", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
			timeZone: "Asia/Tehran",
		}).format(date);

		return `${formattedDate} - ${formattedTime}`;
	} catch {
		return "نامشخص";
	}
}

/**
 * Format only the Persian date
 * Example: "۲۰ آبان ۱۴۰۴"
 */
export function formatDateOnly(dateString?: string | null): string {
	if (!dateString) return "نامشخص";

	const date = toTehranDate(dateString);
	if (!date) return "نامشخص";

	try {
		return new Intl.DateTimeFormat("fa-IR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	} catch {
		return "نامشخص";
	}
}

/**
 * Format only the Persian time (HH:mm, Tehran timezone)
 * Example: "۲۱:۳۰"
 */
export function formatTimeOnly(dateString?: string | null): string {
	if (!dateString) return "نامشخص";

	try {
		// If the string is time-only (HH:mm:ss)
		if (/^\d{2}:\d{2}(:\d{2})?$/.test(dateString)) {
			const [hour, minute] = dateString.split(":");
			return `${hour}:${minute}`;
		}

		// Otherwise treat as full ISO datetime
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "نامشخص";

		return new Intl.DateTimeFormat("fa-IR", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
			timeZone: "Asia/Tehran",
		}).format(date);
	} catch {
		return "نامشخص";
	}
}
