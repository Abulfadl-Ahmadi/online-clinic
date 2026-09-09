"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { formatDate } from "@/lib/utils";
import { RegisterFormData } from "@/types";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectItem,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
	CalendarHijri,
} from "@/components/ui";

const UserGender = {
	male: "male",
	female: "female",
	other: "other",
} as const;

interface StepAdditionalInfoProps {
	form: UseFormReturn<RegisterFormData>;
}

export default function StepAdditionalInfo({ form }: StepAdditionalInfoProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col gap-4">
			<FormField
				control={form.control}
				name="birthday"
				render={({ field }) => (
					<FormItem>
						<FormLabel>تاریخ تولد</FormLabel>
						<FormControl>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-48 justify-between font-normal">
										{field.value
											? formatDate(field.value.toString())
											: "تاریخ تولد را انتخاب کنید"}
										<ChevronDownIcon className="me-2 size-4 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto overflow-hidden p-0"
									align="start">
									<CalendarHijri
										autoFocus
										mode="single"
										selected={new Date(field.value)}
										captionLayout="dropdown"
										onSelect={(selectedDate) => {
											if (!selectedDate) return;

											const isoDate =
												selectedDate.toLocaleDateString(
													"en-CA",
												);
											field.onChange(isoDate);

											setOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="gender"
				render={({ field }) => (
					<FormItem>
						<FormLabel>جنسیت</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
							dir="rtl">
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="جنسیت را انتخاب کنید" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectGroup>
									<SelectItem value={UserGender.male}>
										مرد
									</SelectItem>
									<SelectItem value={UserGender.female}>
										زن
									</SelectItem>
									<SelectItem value={UserGender.other}>
										سایر
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
