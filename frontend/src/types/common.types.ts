import { UserRole } from "./user.types";

export const SessionType = {
	acs: "acs",
	rfs: "rfs",
} as const;

export type SessionType = keyof typeof SessionType;

export interface UserPayload {
	iss?: string | undefined;
	sub?: string | undefined;
	aud?: string | string[] | undefined;
	exp?: number | undefined;
	nbf?: number | undefined;
	iat?: number | undefined;
	jti?: string | undefined;
	id: string;
	role: UserRole;
}

export interface AuthCheckOptions {
	requiredRoles?: UserRole[];
	redirectPath?: string;
}

export interface GetSessionResponse {
	accessToken: string | null;
	userPayload: UserPayload | null;
}

export type ThemeType = "light" | "dark" | "system";

export interface NavLink {
	href: string;
	label: string;
	icon?: React.ReactNode;
}
