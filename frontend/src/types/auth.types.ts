import { z } from "zod";
import {
	LoginSchema,
	RegisterSchema,
	SendOtpSchema,
	VerifyOtpSchema,
	ChangePasswordSchema,
} from "@/lib/validations";

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export type SendOtpFormData = z.infer<typeof SendOtpSchema>;
export type VerifyOtpFormData = z.infer<typeof VerifyOtpSchema>;

export interface ChangePasswordResult {
	message: string;
	success?: boolean;
}


export interface AuthResult {
	access: string;
	refresh: string;
}

export interface RefreshResult {
	access: string;
}

const OtpType = {
	login: "login",
	register: "register",
	reset_password: "reset_password",
} as const;

export type OtpType = keyof typeof OtpType;

export interface SendOtpResult {
	message: string;
}

export interface RegisterResult {
	message: string;
}

export type RegisterState = RegisterFormData & {
	step: number;
	phoneVerified: boolean;
	set: (patch: Partial<RegisterState>) => void;
	reset: () => void;
	_hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
};

export const REGISTER_STORE_KEY =
	process.env.NEXT_PUBLIC_REGISTER_STORE_KEY || "rgs-st";
