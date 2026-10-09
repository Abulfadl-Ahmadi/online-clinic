import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
	return ["/", "/about-us", "/clinic", "/articles", "/en", "/en/about", "/en/clinic", "/en/articles"].map((path) => ({
		url: new URL(path, siteUrl).toString(),
		lastModified: new Date(),
		changeFrequency: path === "/" ? "weekly" : "monthly",
		priority: path === "/" ? 1 : 0.8,
	}));
}
