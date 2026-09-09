"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData } from "@/types";
import { LoginSchema } from "@/lib/validations";
import { loginWithPasswordAction } from "@/actions";

function useLoginWithPasswordForm() {
	// Router
	const searchParams = useSearchParams();
	const next = searchParams.get("next");

	const form = useForm<LoginFormData>({
		resolver: zodResolver(LoginSchema),
		defaultValues: { phone_number: "", password: "" },
	});

	const [loading, setLoading] = useState(false);

	async function onSubmit(values: LoginFormData) {
		setLoading(true);
		try {
			// Convert to FormData because server actions require it
			const formData = new FormData();
			formData.append("phone_number", values.phone_number);
			formData.append("password", values.password);

			// Call the server action
			const result = await loginWithPasswordAction(formData);

			// Handle result
			if (result.success) {
				// Reset form and show success message
				form.reset();
				toast.success(result.message);
				// Redirect to next param or default to /dashboard
				const redirectTo = next ?? "/user/dashboard";

				window.location.href = redirectTo;
			} else {
				toast.error(result.message);
			}
		} catch (err: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("[useLoginForm]", err);
			}

			toast.error("خطای غیرمنتظره");
		} finally {
			setLoading(false);
		}
	}

	return {
		form,
		onSubmit,
		loading,
	};
}

export default useLoginWithPasswordForm;
