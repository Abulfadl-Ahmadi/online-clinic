"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { SessionType, UserPayload } from "@/types";

/**
 * Create a session cookie from a JWT token
 * @param token - The JWT token to create a session cookie from
 * @param type - The type of session token to create (acs or rfs)
 */
async function createSession(
	token: string,
	type: SessionType = "acs",
): Promise<void> {
	const decoded = jwtDecode<UserPayload>(token);

	// Calculate remaining lifetime (in seconds)
	const now = Math.floor(Date.now() / 1000);
	const expiresIn = decoded.exp ? decoded.exp - now : 60 * 60 * 24; // fallback to 1 day

	// Prevent negative maxAge in case token already expired
	const maxAge = Math.max(expiresIn - 5, 0); // expire 5s earlier just in case token is expired

	const cookieStore = await cookies();

	cookieStore.set({
		name: type,
		value: token,
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge, // dynamically set from token exp
	});
}

export default createSession;
