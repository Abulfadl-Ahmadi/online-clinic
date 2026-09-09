"use server";

import { SessionType } from "@/types";
import { cookies } from "next/headers";

/**
 * Delete the session cookie
 */
async function clearSession(): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.delete(SessionType.acs);
	cookieStore.delete(SessionType.rfs);
}

export default clearSession;
