"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import DateObject from "react-date-object";
import { CalendarIcon, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import {
	createRecurringAvailability,
	updateRecurringAvailability,
} from "@/actions/clinic";
import { RecurringAvailabilitySchema } from "@/lib/validations";
import {
	APPOINTMENT_TYPES,
	DAYS_OF_WEEK,
	RecurringAvailability,
	RecurringAvailabilityData,
} from "@/types";

import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Switch,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	CalendarHijri,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui";

interface AvailabilityDialogProps {
	mode?: "create" | "edit";
	availability?: RecurringAvailability;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSuccess?: () => void;
	trigger?: React.ReactNode;
}

export default function AvailabilityDialog({
	mode = "create",
	availability,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	onSuccess,
	trigger,
}: AvailabilityDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

	const form = useForm<RecurringAvailabilityData>({
		resolver: zodResolver(RecurringAvailabilitySchema),
		defaultValues: {
			dayOfWeek: "",
			startTime: "",
			endTime: "",
			priceIrr: "",
			durationMinutes: "",
			appointmentType: "",
			validFrom: undefined,
			validUntil: undefined,
			isActive: true,
		},
	});

	// Synchronize form values on edit or open
	useEffect(() => {
		if (open) {
			if (mode === "edit" && availability) {
				form.reset({
					dayOfWeek: String(availability.dayOfWeek),
					startTime: availability.startTime.slice(0, 5),
					endTime: availability.endTime.slice(0, 5),
					priceIrr: String(availability.priceIrr),
					durationMinutes: String(availability.durationMinutes),
					appointmentType: availability.appointmentType,
					validFrom: availability.validFrom
						? new Date(availability.validFrom)
						: undefined,
					validUntil: availability.validUntil
						? new Date(availability.validUntil)
						: undefined,
					isActive: availability.isActive,
				});
			} else if (mode === "create") {
				form.reset({
					dayOfWeek: "",
					startTime: "",
					endTime: "",
					priceIrr: "",
					durationMinutes: "",
					appointmentType: "",
					validFrom: undefined,
					validUntil: undefined,
					isActive: true,
				});
			}
		}
	}, [open, mode, availability, form]);

	async function onSubmit(values: RecurringAvailabilityData) {
		setIsSubmitting(true);
		try {
			let result;
			if (mode === "edit" && availability) {
				result = await updateRecurringAvailability(
					availability.id,
					values,
				);
			} else {
				result = await createRecurringAvailability(values);
			}

			if (result.success) {
				toast.success(
					result.message ||
						(mode === "edit"
							? "زمانبندی با موفقیت ویرایش شد"
							: "پذیرش جدید با موفقیت اضافه شد"),
				);
				setOpen?.(false);
				onSuccess?.();
			} else {
				toast.error(result.message || "خطا در ذخیره زمانبندی");
			}
		} catch {
			toast.error("خطای غیرمنتظره رخ داد");
		} finally {
			setIsSubmitting(false);
		}
	}

	const formatPersianDate = (date: Date | undefined) => {
		if (!date) return "تاریخ را انتخاب کنید";
		const persianDate = new DateObject({
			date,
			calendar: persian,
			locale: persian_fa,
		});
		return persianDate.format("YYYY/MM/DD");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ? (
					trigger
				) : (
					<Button className="gap-2">
						<Plus className="size-4" />
						افزودن روز
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[650px]" dir="rtl">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit"
							? "ویرایش زمانبندی پذیرش"
							: "افزودن زمانبندی جدید"}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4">
						{/* Day of week */}
						<FormField
							control={form.control}
							name="dayOfWeek"
							render={({ field }) => (
								<FormItem>
									<FormLabel>روز هفته</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="روز را انتخاب کنید" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{DAYS_OF_WEEK.map((d) => (
														<SelectItem
															key={d.value}
															value={d.value}>
															{d.label}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Start and End Times */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>زمان شروع</FormLabel>
										<FormControl>
											<Input
												type="time"
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>زمان پایان</FormLabel>
										<FormControl>
											<Input
												type="time"
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Price and Duration */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="priceIrr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>مبلغ (IRR)</FormLabel>
										<FormControl>
											<Input
												placeholder="مثال: 100000"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="durationMinutes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>مدت زمان (دقیقه)</FormLabel>
										<FormControl>
											<Input
												placeholder="مثال: 30"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Appointment Type */}
						<FormField
							control={form.control}
							name="appointmentType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>نوع نوبت</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="نوع نوبت را انتخاب کنید" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{APPOINTMENT_TYPES.map(
														(t) => (
															<SelectItem
																key={t.value}
																value={t.value}>
																{t.label}
															</SelectItem>
														),
													)}
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Date Ranges */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="validFrom"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>اعتبار از</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full ps-3 text-start font-normal",
															!field.value &&
																"text-muted-foreground",
														)}>
														{formatPersianDate(
															field.value,
														)}
														<CalendarIcon className="ms-auto size-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start">
												<CalendarHijri
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date <
														new Date(
															new Date().setHours(
																0,
																0,
																0,
																0,
															),
														)
													}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="validUntil"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>اعتبار تا</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full ps-3 text-start font-normal",
															!field.value &&
																"text-muted-foreground",
														)}>
														{formatPersianDate(
															field.value,
														)}
														<CalendarIcon className="ms-auto size-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start">
												<CalendarHijri
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date <
														new Date(
															new Date().setHours(
																0,
																0,
																0,
																0,
															),
														)
													}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Is Active Switch */}
						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between">
									<div className="space-y-0">
										<FormLabel>فعال باشد</FormLabel>
									</div>
									<FormControl>
										<Switch
											dir="ltr"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* Submit Buttons */}
						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setOpen?.(false)}
								disabled={isSubmitting}>
								انصراف
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting
									? "در حال ذخیره..."
									: mode === "edit"
										? "ذخیره تغییرات"
										: "ذخیره"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
