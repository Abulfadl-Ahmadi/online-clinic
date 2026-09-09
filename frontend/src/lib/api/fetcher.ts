"use server";

import { ENV } from "@/config";
import { ApiResult, ErrorStatusMap, ErrorType } from "@/types";
import { keysToCamel } from "@/lib/utils/case-converter";

async function apiFetch<T>(
	url: string,
	options: RequestInit = {},
	cache: RequestCache = "no-store",
): Promise<ApiResult<T>> {
	try {
		const fullUrl = `${ENV.BASE_API_URL}${url}`;
		
		// Enhanced logging for debugging
		console.log("\n🌐 [apiFetch] Request Details:");
		console.log("  URL:", fullUrl);
		console.log("  Method:", options.method || "GET");
		console.log("  Headers:", JSON.stringify(options.headers, null, 2));
		if (options.body) {
			console.log("  Body (raw):", options.body);
			try {
				const parsedBody = JSON.parse(options.body as string);
				console.log("  Body (parsed):", JSON.stringify(parsedBody, null, 2));
			} catch {
				console.log("  Body: (not JSON)");
			}
		}
		
		const response = await fetch(fullUrl, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			cache: cache,
		});

		console.log("  Response Status:", response.status, response.statusText);

		const isJson = response.headers
			.get("content-type")
			?.includes("application/json");
		const body = isJson ? await response.json().catch(() => null) : null;

		console.log("  Response Body (raw):", JSON.stringify(body, null, 2));

		if (!response.ok) {
			const errorType =
				Object.entries(ErrorStatusMap).find(
					([, code]) => code === response.status,
				)?.[0] ?? "Internal";

			console.log("  ❌ Request Failed!");
			console.log("  Error Type:", errorType);
			console.log("  Error Message:", body?.message || "No message");

			return {
				success: false,
				message:
					body?.message ||
					`Request failed with status ${response.status}`,
				statusCode: response.status,
				type: errorType as ErrorType,
			};
		}

		// Convert snake_case keys to camelCase
		const transformedData = keysToCamel<T>(body);

		console.log("  Response Body (transformed):", JSON.stringify(transformedData, null, 2));
		console.log("  ✅ Request Successful!\n");

		return {
			success: true,
			data: transformedData,
			message: "درخواست با موفقیت انجام شد",
		};
	} catch (err: unknown) {
		console.error("\n💥 [apiFetch] Exception:", err);
		if (process.env.NODE_ENV === "development") {
			console.error("[apiFetch] Full error:", err);
		}

		return {
			success: false,
			message: "خطای داخلی",
			statusCode: 500,
			type: "Internal",
		};
	}
}

export default apiFetch;
