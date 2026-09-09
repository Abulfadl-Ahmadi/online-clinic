import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
	output: "standalone",
	reactStrictMode: process.env.NODE_ENV === "development",

	basePath: basePath,

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "127.0.0.1",
			},
			{
				protocol: "https",
				hostname: "upload.wikimedia.org",
				pathname: "/wikipedia/**", // covers /wikipedia/commons/... etc.
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
		],
	},

	eslint: {
		ignoreDuringBuilds: true,
	},

	typescript: {
		ignoreBuildErrors: true,
	},

	typedRoutes: true,
};

export default nextConfig;
