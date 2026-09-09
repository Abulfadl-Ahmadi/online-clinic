"use client";

import { RegisterFormData } from "@/types";
import { UseFormReturn } from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Input,
} from "@/components/ui";

interface StepAccountInfoProps {
	form: UseFormReturn<RegisterFormData>;
}

function StepPasswordInfo({ form }: StepAccountInfoProps) {
	return (
		<div className="flex flex-col gap-4">
			<FormField
				control={form.control}
				name="password"
				render={({ field }) => (
					<FormItem>
						<FormLabel>رمز عبور</FormLabel>
						<FormControl>
							<Input
								type="password"
								autoComplete="new-password"
								placeholder={"••••••••"}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="confirmPassword"
				render={({ field }) => (
					<FormItem>
						<FormLabel>تکرار رمز عبور</FormLabel>
						<FormControl>
							<Input
								type="password"
								autoComplete="new-password"
								placeholder={"••••••••"}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}

export default StepPasswordInfo;
