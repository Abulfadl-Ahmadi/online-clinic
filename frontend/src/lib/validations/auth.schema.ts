import { z } from "zod";

export const UserGender = z.enum(["male", "female", "other"]);
export type UserGenderType = z.infer<typeof UserGender>;

const phoneRegex = /^09\d{9}$/;

const nationalCodeRegex = /^\d{10}$/;

// -------------------- Schemas -------------------- //

export const LoginSchema = z.object({
	phone_number: z
		.string()
		.min(11, "شماره تلفن باید ۱۱ رقم باشد")
		.max(11, "شماره تلفن باید ۱۱ رقم باشد")
		.regex(phoneRegex, "شماره همراه معتبر نیست"),
	password: z.string().min(1, "رمز عبور باید حداقل 1 کاراکتر باشد"),
});

export const SendOtpSchema = z.object({
	phone_number: z
		.string()
		.min(11, "شماره تلفن باید ۱۱ رقم باشد")
		.max(11, "شماره تلفن باید ۱۱ رقم باشد")
		.regex(phoneRegex, "شماره همراه معتبر نیست"),
});

export const VerifyOtpSchema = z.object({
	phone_number: z
		.string()
		.min(11, "شماره تلفن باید ۱۱ رقم باشد")
		.max(11, "شماره تلفن باید ۱۱ رقم باشد")
		.regex(phoneRegex, "شماره همراه معتبر نیست"),
	otp: z
		.string()
		.min(6, "کد باید ۶ رقم باشد")
		.max(6, "کد باید ۶ رقم باشد")
		.regex(/^\d+$/, "کد باید فقط شامل عدد باشد"),
});

export const RegisterSchema = z
	.object({
		first_name: z
			.string("نام الزامی است")
			.min(2, "نام باید حداقل ۲ کاراکتر داشته باشد")
			.max(50, "نام باید حداکثر ۵۰ کاراکتر داشته باشد"),

		last_name: z
			.string("نام خانوادگی الزامی است")
			.min(2, "نام خانوادگی باید حداقل ۲ کاراکتر داشته باشد")
			.max(50, "نام خانوادگی باید حداکثر ۵۰ کاراکتر داشته باشد"),

		national_code: z
			.string()
			.length(10, "کد ملی باید دقیقاً ۱۰ رقم باشد")
			.regex(nationalCodeRegex, "کد ملی معتبر نیست"),

		gender: UserGender,

		birthday: z.string("تاریخ تولد الزامی است").refine((val) => {
			const date = new Date(val);
			if (isNaN(date.getTime())) return false;
			const minDate = new Date("1900-01-01");
			const maxDate = new Date();
			return date >= minDate && date <= maxDate;
		}, "تاریخ تولد معتبر نیست"),

		password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),

		confirmPassword: z.string("تکرار رمز عبور الزامی است"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "رمز عبور و تکرار آن باید یکسان باشند",
		path: ["confirmPassword"],
	});
