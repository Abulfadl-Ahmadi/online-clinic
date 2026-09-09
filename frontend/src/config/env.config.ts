import { z } from "zod";

/** ================================
 *  Environment Schema
 *  ================================ */
const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]),
	BASE_API_URL: z.url({
		message:
			"Invalid URL format for BASE_API_URL (must be a valid absolute URL).",
	}),
	API_TIMEOUT_MS: z.string("must be a valid integer in milliseconds"),
	NEXT_PUBLIC_REGISTER_STORE_KEY: z.string(),
});

/** ================================
 *  Parse & Validate
 *  ================================ */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables detected:\n");
	parsed.error.issues.forEach((err) => {
		console.error(err.message);
	});
	console.error(
		"\n💡 Please check your .env or environment configuration.\n",
	);
	throw new Error("Environment validation failed.");
}

/** ================================
 *  Success Logging (optional)
 *  ================================ */
console.log("✅ Environment variables validated successfully.");

/** ================================
 *  Export
 *  ================================ */
export const ENV = parsed.data;
export type Env = z.infer<typeof envSchema>;
export default ENV;
