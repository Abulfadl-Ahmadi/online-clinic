"use server";

/**
 * Helper function to add a timeout to a promise.
 * @param promise - The promise to wrap.
 * @param timeout - Timeout duration in milliseconds.
 */
export async function withTimeout<T>(
	promise: Promise<T>,
	timeout: number,
): Promise<T> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		return await Promise.race([
			promise,
			new Promise<never>((_, reject) =>
				controller.signal.addEventListener("abort", () =>
					reject(new Error("Request timed out")),
				),
			),
		]);
	} finally {
		clearTimeout(timeoutId);
	}
}
