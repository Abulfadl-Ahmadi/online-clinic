"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { useChangePasswordForm } from "@/hooks";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Spinner,
} from "@/components/ui";

interface ChangePasswordFormProps {
	onSuccess?: () => void;
	className?: string;
}

function ChangePasswordForm({ onSuccess, className }: ChangePasswordFormProps) {
	const { form, onSubmit, loading } = useChangePasswordForm({ onSuccess });

	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={`flex flex-col gap-5 ${className ?? ""}`}
				dir="rtl">
				{/* Old Password */}
				<FormField
					control={form.control}
					name="old_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium flex items-center gap-1.5">
								<Lock className="size-4 text-muted-foreground" />
								رمز عبور فعلی
							</FormLabel>
							<div className="relative">
								<FormControl>
									<Input
										autoFocus
										type={showOldPassword ? "text" : "password"}
										placeholder="رمز عبور فعلی خود را وارد کنید"
										className="pe-10"
										autoComplete="current-password"
										{...field}
									/>
								</FormControl>
								<button
									type="button"
									onClick={() => setShowOldPassword((prev) => !prev)}
									className="absolute inset-y-0 left-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus:outline-none"
									tabIndex={-1}
									aria-label={showOldPassword ? "مخفی کردن رمز" : "نمایش رمز"}>
									{showOldPassword ? (
										<EyeOff className="size-4" />
									) : (
										<Eye className="size-4" />
									)}
								</button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* New Password */}
				<FormField
					control={form.control}
					name="new_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium flex items-center gap-1.5">
								<KeyRound className="size-4 text-muted-foreground" />
								رمز عبور جدید
							</FormLabel>
							<div className="relative">
								<FormControl>
									<Input
										type={showNewPassword ? "text" : "password"}
										placeholder="حداقل ۸ کاراکتر"
										className="pe-10"
										autoComplete="new-password"
										{...field}
									/>
								</FormControl>
								<button
									type="button"
									onClick={() => setShowNewPassword((prev) => !prev)}
									className="absolute inset-y-0 left-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus:outline-none"
									tabIndex={-1}
									aria-label={showNewPassword ? "مخفی کردن رمز" : "نمایش رمز"}>
									{showNewPassword ? (
										<EyeOff className="size-4" />
									) : (
										<Eye className="size-4" />
									)}
								</button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Confirm New Password */}
				<FormField
					control={form.control}
					name="confirm_new_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium flex items-center gap-1.5">
								<KeyRound className="size-4 text-muted-foreground" />
								تکرار رمز عبور جدید
							</FormLabel>
							<div className="relative">
								<FormControl>
									<Input
										type={showConfirmPassword ? "text" : "password"}
										placeholder="تکرار رمز عبور جدید را وارد کنید"
										className="pe-10"
										autoComplete="new-password"
										{...field}
									/>
								</FormControl>
								<button
									type="button"
									onClick={() => setShowConfirmPassword((prev) => !prev)}
									className="absolute inset-y-0 left-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus:outline-none"
									tabIndex={-1}
									aria-label={showConfirmPassword ? "مخفی کردن رمز" : "نمایش رمز"}>
									{showConfirmPassword ? (
										<EyeOff className="size-4" />
									) : (
										<Eye className="size-4" />
									)}
								</button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Submit Button */}
				<Button
					type="submit"
					className="w-full mt-2 font-medium"
					disabled={loading}>
					{loading ? (
						<>
							<Spinner className="size-4 me-2" />
							در حال تغییر رمز عبور...
						</>
					) : (
						"تغییر رمز عبور"
					)}
				</Button>
			</form>
		</Form>
	);
}

export default ChangePasswordForm;
