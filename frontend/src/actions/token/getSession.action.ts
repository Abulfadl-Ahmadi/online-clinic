"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

import { apiFetch } from "@/lib/api";
import createSession from "./createSession.action";
import {
	RefreshResult,
	GetSessionResponse,
	SessionType,
	UserPayload,
} from "@/types";

/**
 * Get the session cookie from the request headers
 * @returns The session cookie from the request headers
 */
async function getSession(): Promise<GetSessionResponse> {
	try {
		// Get the tokens cookie from the request headers
		const cookieStore = await cookies();

		const refreshToken = cookieStore.get(SessionType.rfs)?.value;
		const accessToken = cookieStore.get(SessionType.acs)?.value;

		// if the refreshToken is not set, return null
		if (!refreshToken) {
			return {
				accessToken: null,
				userPayload: null,
			};
		}

		if (accessToken) {
			return {
				accessToken: accessToken,
				userPayload: jwtDecode<UserPayload>(accessToken),
			};
		} else {
			const response = await apiFetch<RefreshResult>(
				"/authentication/refresh/",
				{
					method: "POST",
					body: JSON.stringify({ refresh: refreshToken }),
				},
			);

			if (!response.success) {
				return {
					accessToken: null,
					userPayload: null,
				};
			}

			const data = response.data;

			// Save access token securely
			await createSession(data.access, "acs");

			return {
				accessToken: data.access,
				userPayload: jwtDecode<UserPayload>(data.access),
			};
		}
	} catch (error: unknown) {
		if (process.env.NODE_ENV === "development") {
			console.error("[getSession]", error);
		}
		return {
			accessToken: null,
			userPayload: null,
		};
	}
}

export default getSession;
