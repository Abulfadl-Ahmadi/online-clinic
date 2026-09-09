import { getSession } from "@/actions";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	// Redirect to login page if the user is not authenticated
	const redirectUrl = new URL("/auth/login", request.url);
	// Preserve the original URL in the 'next' parameter
	redirectUrl.searchParams.set("next", request.url);

	try {
		// Check if the user is authenticated
		const { accessToken, userPayload } = await getSession();

		// Redirect to login if the user is not authenticated
		if (!accessToken || !userPayload) {
			return NextResponse.redirect(redirectUrl, { status: 303 });
		}

		// Doctor route protection
		if (request.nextUrl.pathname.startsWith("/doctor")) {
			// Check if the user is a doctor
			if (userPayload.role !== "doctor") {
				return NextResponse.redirect(redirectUrl, { status: 303 });
			}
		}

		// Admin route protection
		if (request.nextUrl.pathname.startsWith("/admin")) {
			// Check if the user is an admin
			if (userPayload.role !== "admin") {
				return NextResponse.redirect(redirectUrl, { status: 303 });
			}
		}

		// Allow the request to proceed if all checks pass
		return NextResponse.next();
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Error during middleware:", error);
		}
		return NextResponse.redirect(redirectUrl, { status: 303 });
	}
}

// Apply middleware to specific routes only
export const config = {
	matcher: ["/user/:path*", "/doctor/:path*", "/admin/:path*"],
};
