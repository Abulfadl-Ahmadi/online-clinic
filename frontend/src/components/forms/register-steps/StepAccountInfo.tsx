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

function StepAccountInfo({ form }: StepAccountInfoProps) {
	return (
		<div className="flex flex-col gap-4">
			<FormField
				control={form.control}
				name="national_code"
				render={({ field }) => (
					<FormItem>
						<FormLabel>کد ملی</FormLabel>
						<FormControl>
							<Input
								type="number"
								autoFocus={true}
								placeholder={"042..."}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="first_name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>نام</FormLabel>
						<FormControl>
							<Input
								type="text"
								autoComplete="name"
								placeholder={"نام خود را وارد کنید"}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="last_name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>نام خانوادگی</FormLabel>
						<FormControl>
							<Input
								type="text"
								autoComplete="family-name"
								placeholder={"نام خانوادگی خود را وارد کنید"}
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

export default StepAccountInfo;
