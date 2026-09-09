import { z } from "zod";

export const RecurringAvailabilitySchema = z
	.object({
		dayOfWeek: z.string().nonempty("روز هفته را انتخاب کنید"),
		startTime: z.string().nonempty("زمان شروع را وارد کنید"),
		endTime: z.string().nonempty("زمان پایان را وارد کنید"),
		priceIrr: z.string().min(1, "مبلغ الزامی است"),
		durationMinutes: z.string().min(1, "مدت زمان الزامی است"),
		appointmentType: z.string().nonempty("نوع نوبت را انتخاب کنید"),
		validFrom: z.date().optional(),
		validUntil: z.date().optional(),
		isActive: z.boolean(),
	})
	.refine(
		(data) => {
			if (!data.startTime || !data.endTime) return true; // skip if empty, already handled
			const [startH, startM] = data.startTime.split(":").map(Number);
			const [endH, endM] = data.endTime.split(":").map(Number);
			return startH < endH || (startH === endH && startM < endM);
		},
		{
			message: "زمان پایان باید بعد از زمان شروع باشد",
			path: ["endTime"], // attach error to endTime field
		},
	);
