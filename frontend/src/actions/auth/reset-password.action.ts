"use server";

import { apiFetch } from "@/lib/api";

export async function resetPasswordAction(formData: FormData) {
	const response = await apiFetch<{ message: string }>("/authentication/reset-password/", {
		method: "POST",
		body: JSON.stringify({
			phone_number: formData.get("phone_number"),
			code: formData.get("code"),
			new_password: formData.get("new_password"),
		}),
	});
	return {
		success: response.success,
		message: response.success
			? "رمز عبور تغییر کرد. اکنون وارد شوید."
			: "کد یا رمز عبور معتبر نیست. دوباره بررسی کنید.",
	};
}
