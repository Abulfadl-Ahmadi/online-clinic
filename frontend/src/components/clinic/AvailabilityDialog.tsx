"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import DateObject from "react-date-object";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { createRecurringAvailability } from "@/actions/clinic";
import { RecurringAvailabilitySchema } from "@/lib/validations";
import {
	APPOINTMENT_TYPES,
	DAYS_OF_WEEK,
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

export default function AvailabilityDialog() {
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

	async function onSubmit(values: RecurringAvailabilityData) {
		// Call the server action
		const result = await createRecurringAvailability(values);

		if (result.success) {
			toast.success(result.message || "پذیرش جدید با موفقیت اضافه شد");
			form.reset();
			window.location.reload();
			return;
		}

		toast.error(result.message || "خطا در ثبت پذیرش");
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
		<Dialog>
			<DialogTrigger asChild>
				<Button>افزودن روز</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[650px]">
				<DialogHeader>
					<DialogTitle>افزودن زمان‌بندی</DialogTitle>
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
													{APPOINTMENT_TYPES.map((t) => (
														<SelectItem
															key={t.value}
															value={t.value}>
															{t.label}
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
														date < new Date()
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
														date < new Date()
													}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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

						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="ghost"
								onClick={() => form.reset()}>
								بازنشانی
							</Button>
							<Button type="submit">ذخیره</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
