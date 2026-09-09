import { ThemeType } from "./common.types";

const UserRole = {
	admin: "admin",
	user: "user",
	doctor: "doctor",
} as const;

export type UserRole = keyof typeof UserRole;

const UserGender = {
	male: "male",
	female: "female",
	other: "other",
} as const;

export type UserGender = keyof typeof UserGender;

export type UserSettings = {
	theme: ThemeType;
	language: "fa" | "en";
};

export type UserProfile = {
	gender: UserGender;
	birthday?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	nationalCode?: string | null;
	avatar?: string | null;
};

export type User = {
	id: string;
	phoneNumber: string;
	updatedAt: string;
	createdAt: string;

	profile: UserProfile;
	settings: UserSettings;
};

export interface SettingsResult {
	message: string;
}

export interface UserStore {
	user: User | null;
	isAuthenticated: boolean;
	useRole: UserRole | null;
	set: (patch: Partial<UserStore>) => void;
	reset: () => void;
}
