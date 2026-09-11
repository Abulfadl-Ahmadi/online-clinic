"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChangePasswordFormData } from "@/types";
import { ChangePasswordSchema } from "@/lib/validations";
import { changePasswordAction } from "@/actions";

interface UseChangePasswordFormProps {
	onSuccess?: () => void;
}

function useChangePasswordForm({ onSuccess }: UseChangePasswordFormProps = {}) {
	const form = useForm<ChangePasswordFormData>({
		resolver: zodResolver(ChangePasswordSchema),
		defaultValues: {
			old_password: "",
			new_password: "",
			confirm_new_password: "",
		},
	});

	const [loading, setLoading] = useState(false);

	async function onSubmit(values: ChangePasswordFormData) {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("old_password", values.old_password);
			formData.append("new_password", values.new_password);
			formData.append("confirm_new_password", values.confirm_new_password);

			const result = await changePasswordAction(formData);

			if (result.success) {
				form.reset();
				toast.success(result.message || "رمز عبور با موفقیت تغییر یافت");
				onSuccess?.();
			} else {
				toast.error(result.message || "خطا در تغییر رمز عبور");
			}
		} catch (err: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("[useChangePasswordForm]", err);
			}
			toast.error("خطای غیرمنتظره در تغییر رمز عبور");
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

export default useChangePasswordForm;
