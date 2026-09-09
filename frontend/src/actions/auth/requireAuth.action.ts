"use server";

import { redirect } from "next/navigation";
import { getSession } from "../token";
import { AuthCheckOptions, UserPayload } from "@/types";

/**
 * Redirect user to login page with optional next param
 */
function redirectToLogin(next?: string) {
	const loginUrl = next
		? `/auth/login?next=${encodeURIComponent(next)}`
		: "/auth/login";
	redirect(loginUrl as "/");
}

/**
 * Require user authentication
 * @param options.requiredRoles - Optional roles to authorize
 * @param options.redirectPath - Optional path to redirect if unauthorized (default: current page)
 * @returns UserPayload if authenticated and authorized
 */
async function requireAuth(
	options?: AuthCheckOptions,
): Promise<UserPayload | null> {
	const { accessToken, userPayload } = await getSession();

	// Not logged in
	if (!accessToken || !userPayload) {
		redirectToLogin(options?.redirectPath);
	}

	// Role-based check
	if (options?.requiredRoles?.length) {
		const hasRole = options.requiredRoles.some(
			(role) => role === userPayload?.role, // or adjust if multiple roles per user
		);
		if (!hasRole) {
			// Redirect to login or 403 page
			redirectToLogin(options?.redirectPath);
		}
	}

	return userPayload;
}

export default requireAuth;
