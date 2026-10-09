"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const persianToEnglish: Record<string, string> = {
  "/": "/en",
  "/about-us": "/en/about",
  "/clinic": "/en/clinic",
  "/articles": "/en/articles",
};
const englishToPersian = Object.fromEntries(
  Object.entries(persianToEnglish).map(([fa, en]) => [en, fa]),
);

export function localeDestination(pathname: string, target: "fa" | "en") {
  if (target === "en") return persianToEnglish[pathname] ?? (pathname.startsWith("/articles/") ? "/en/articles" : "/en");
  return englishToPersian[pathname] ?? "/";
}

export function LocaleSwitchLink({ target, className, onClick }: {
  target: "fa" | "en";
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  return (
    <Link href={localeDestination(pathname, target) as Route} hrefLang={target} lang={target} onClick={onClick} className={className}>
      {target === "fa" ? "فارسی" : "English"}
    </Link>
  );
}
