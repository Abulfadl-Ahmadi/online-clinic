"use client";

import { toast } from "sonner";
import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

import { ThemeType } from "@/types";
import { useUser } from "@/context";
import { getSession, setThemeAction } from "@/actions";

function useThemeSwitcher() {
	const { user } = useUser();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const getNextTheme = () => {
		switch (theme) {
			case "light":
				return "dark";

			case "dark":
				return "system";

			case "system":
				return "light";

			default:
				return "light";
		}
	};

	async function syncTheme(theme: ThemeType) {
		const result = await setThemeAction(theme);

		if (result.success) {
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}

	const handleToggle = async () => {
		const nextTheme = getNextTheme();

		setTheme(nextTheme);

		const { accessToken, userPayload } = await getSession();

		if (accessToken && userPayload) {
			syncTheme(nextTheme);
		}
	};

	useEffect(() => {
		setMounted(true);
		if (user) {
			setTheme(user.settings.theme);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!mounted) return { theme: undefined, handleToggle: () => {} };

	return {
		theme,
		handleToggle,
	};
}

export default useThemeSwitcher;
