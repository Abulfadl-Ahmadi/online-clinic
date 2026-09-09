"use client";

import { toast } from "sonner";
import { logoutAction } from "@/actions";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

function useLogout() {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			// clear user session
			await logoutAction();
			// redirect to login page
			toast.success("خروج موفقیت‌آمیز بود");
			startTransition(() => router.push("/auth/login"));
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error("[LogoutAction]", error);
			}

			toast.error("خطا در خروج");
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		handleLogout,
	};
}

export default useLogout;
