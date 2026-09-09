"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "@/actions/token";
import { ApiResult, CategoriesListResponse, Category } from "@/types";

const CATEGORIES_BASE = "/articles/categories/";

export interface CategoriesQueryParams {
	page?: number;
	search?: string;
	slug?: string;
	ordering?: "name" | "created_at" | `-${string}` | string;
}

function buildQuery(params: CategoriesQueryParams = {}): string {
	const sp = new URLSearchParams();
	if (params.page) sp.set("page", String(params.page));
	if (params.search) sp.set("search", params.search);
	if (params.slug) sp.set("slug", params.slug);
	if (params.ordering) sp.set("ordering", params.ordering);
	const qs = sp.toString();
	return qs ? `${CATEGORIES_BASE}?${qs}` : CATEGORIES_BASE;
}

export async function listCategories(
	params: CategoriesQueryParams = {},
): Promise<ApiResult<CategoriesListResponse>> {
	const url = buildQuery({ page: params.page ?? 1, ...params });

	const response = await apiFetch<CategoriesListResponse>(
		url,
		{
			method: "GET",
			next: { revalidate: 10 },
		},
		"reload",
	);

	return response;
}

export async function getCategory(slug: string): Promise<ApiResult<Category>> {
	const url = `${CATEGORIES_BASE}${slug}/`;
	return apiFetch<Category>(url, { method: "GET" });
}

/** ================================
 *  Create Category (Admin only)
 *  ================================ */
export async function createCategory(
	name: string,
	slug?: string,
): Promise<ApiResult<Category>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "برای ایجاد دسته‌بندی باید وارد شوید",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	// Generate slug from name if not provided
	const generatedSlug =
		slug ||
		name
			.trim()
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w\u0600-\u06FF-]/g, ""); // Allow Persian characters

	const payload = { name, slug: generatedSlug };
	console.log(
		"📁 [createCategory] Payload:",
		JSON.stringify(payload, null, 2),
	);
	console.log("📁 [createCategory] URL:", CATEGORIES_BASE);
	console.log(
		"📁 [createCategory] Token:",
		accessToken ? "✅ Present" : "❌ Missing",
	);

	const result = await apiFetch<Category>(CATEGORIES_BASE, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(payload),
	});

	console.log("📁 [createCategory] Result:", JSON.stringify(result, null, 2));

	return result;
}

/** ================================
 *  Update Category (Admin only)
 *  ================================ */
export async function updateCategory(
	slug: string,
	name: string,
	newSlug?: string,
): Promise<ApiResult<Category>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "برای ویرایش دسته‌بندی باید وارد شوید",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `${CATEGORIES_BASE}${slug}/`;

	// Include slug in payload if provided
	const payload = newSlug ? { name, slug: newSlug } : { name };

	console.log("📁 [updateCategory] Slug:", slug);
	console.log(
		"📁 [updateCategory] Payload:",
		JSON.stringify(payload, null, 2),
	);
	console.log("📁 [updateCategory] URL:", url);

	const result = await apiFetch<Category>(url, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(payload),
	});

	console.log("📁 [updateCategory] Result:", JSON.stringify(result, null, 2));

	return result;
}

/** ================================
 *  Delete Category (Admin only)
 *  ================================ */
export async function deleteCategory(slug: string): Promise<ApiResult<null>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "برای حذف دسته‌بندی باید وارد شوید",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `${CATEGORIES_BASE}${slug}/`;

	return apiFetch<null>(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
}
