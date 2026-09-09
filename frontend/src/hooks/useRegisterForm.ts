"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerAction } from "@/actions";
import { useRegisterStore } from "@/lib/stores";
import { RegisterSchema } from "@/lib/validations";
import { REGISTER_STORE_KEY, RegisterFormData } from "@/types";
import {
	StepAccountInfo,
	StepAdditionalInfo,
	StepPasswordInfo,
} from "@/components/forms";

function useRegisterForm() {
	// Store
	const registerStore = useRegisterStore();
	const { step } = registerStore;

	// Define the total number of steps
	const totalSteps = 3;
	const getStepFields = (s: number) => {
		if (s === 1) return ["first_name", "last_name", "national_code"];
		if (s === 2) return ["birthday", "gender"];
		return ["password", "confirmPassword"];
	};

	// Determine the current step component here
	const StepComponent = useMemo(() => {
		const steps = [StepAccountInfo, StepAdditionalInfo, StepPasswordInfo];
		return steps[step - 1];
	}, [step]);

	// Form

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			// step 1
			first_name: registerStore.first_name,
			last_name: registerStore.last_name,
			national_code: registerStore.national_code,
			// step 2
			birthday: registerStore.birthday,
			gender: registerStore.gender,
			// step 3
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	});

	// Handlers
	const handleNext = async () => {
		const ok = await form.trigger(
			getStepFields(step) as (keyof RegisterFormData)[],
		);
		if (ok) registerStore.set({ step: Math.min(totalSteps, step + 1) });
	};

	const handleBack = () => registerStore.set({ step: Math.max(1, step - 1) });

	// Sync form -> store
	useEffect(() => {
		const subscription = form.watch((values) => {
			registerStore.set({
				// step 1
				national_code: values.national_code,
				first_name: values.first_name,
				last_name: values.last_name,
				// step 2
				birthday: values.birthday,
				gender: values.gender,
				// step 3
				password: values.password,
				confirmPassword: values.confirmPassword,
			});
		});
		return () => subscription.unsubscribe();
	}, [form, registerStore]);

	// Reset form from store on mount
	useEffect(() => {
		if (registerStore._hasHydrated) {
			form.reset({
				// step 1
				national_code: registerStore.national_code,
				first_name: registerStore.first_name,
				last_name: registerStore.last_name,
				// step 2
				birthday: registerStore.birthday,
				gender: registerStore.gender,
				// step 3
				password: "",
				confirmPassword: "",
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [registerStore._hasHydrated]);

	/**
	 * Handle form submission
	 */
	async function onSubmit(values: RegisterFormData): Promise<void> {
		try {
			// Convert to FormData because server actions require it
			const formData = new FormData();
			formData.append("national_code", values.national_code);
			formData.append("first_name", values.first_name);
			formData.append("last_name", values.last_name);
			formData.append("birthday", values.birthday as string);
			formData.append("gender", values.gender);
			formData.append("password", values.password);
			formData.append("confirmPassword", values.confirmPassword);

			// Call the server action
			const result = await registerAction(formData);
			if (result.success) {
				// Reset form and remove storage
				form.reset();
				registerStore.reset();
				localStorage.removeItem(REGISTER_STORE_KEY);
				// Redirect to main page with success message
				toast.success(result.message);
				window.location.href = "/user/dashboard";
			} else {
				toast.error(result.message);
			}
		} catch (error: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("[useRegisterForm onSubmit]", error);
			}
			toast.error("خطای غیرمنتظره");
		}
	}

	return {
		form,
		step,
		totalSteps,
		handleNext,
		handleBack,
		onSubmit,
		StepComponent,
	};
}

export default useRegisterForm;
