"use client";

import { Button } from "@/components/ui";
import { useThemeSwitcher } from "@/hooks";
import { themeLabel } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MoonIcon, SunIcon, LaptopIcon } from "lucide-react";

interface ThemeSwitcherProps {
	locale?: "fa" | "en";
}

function ThemeSwitcher({ locale = "fa" }: ThemeSwitcherProps) {
	const { theme, handleToggle } = useThemeSwitcher();
	const reduceMotion = useReducedMotion();
	const currentTheme = theme ?? "system";
	const label = locale === "en"
		? { light: "Light", dark: "Dark", system: "System" }[currentTheme as "light" | "dark" | "system"]
		: themeLabel(currentTheme);

	const renderIcon = () => {
		switch (theme) {
			case "dark":
				return <MoonIcon className="size-4 text-foreground" />;
			case "system":
				return <LaptopIcon className="size-4 text-info" />;
			default:
				return <SunIcon className="size-4 text-warning" />;
		}
	};

	return (
		<Button
			size="icon-sm"
			variant="outline"
			onClick={handleToggle}
			title={locale === "en" ? `Theme: ${label}` : `تم: ${label}`}
			aria-label={locale === "en" ? `Change theme; current setting: ${label}` : `تغییر تم؛ حالت فعلی: ${label}`}
			className="size-11 shrink-0 overflow-hidden rounded-full border border-border transition-colors hover:border-primary/30 hover:bg-primary/10">
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={theme}
					initial={reduceMotion ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
					animate={{ opacity: 1, rotate: 0, scale: 1 }}
					exit={reduceMotion ? { opacity: 1 } : { opacity: 0, rotate: 90, scale: 0.6 }}
					transition={{ duration: reduceMotion ? 0 : 0.15, ease: "easeInOut" }}
					className="flex-shrink-0 flex items-center justify-center p-1">
					{renderIcon()}
				</motion.div>
			</AnimatePresence>

		</Button>
	);
}

export default ThemeSwitcher;
