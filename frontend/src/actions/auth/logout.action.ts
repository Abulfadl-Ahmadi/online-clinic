"use server";

import { clearSession } from "../token";

/**
 * Logout user action by deleting the session cookie
 */
async function logoutAction(): Promise<void> {
	// Delete the session cookie
	await clearSession();
}

export default logoutAction;
