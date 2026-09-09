"use server";

import { apiFetch } from "@/lib/api";
import { getSession } from "@/actions/token";
import { ApiResult, TagsListResponse, Tag } from "@/types";

const TAGS_BASE = "/articles/tags/";

export interface TagsQueryParams {
	page?: number;
	search?: string;
	slug?: string;
	ordering?: "name" | "created_at" | `-${string}` | string;
}

function buildQuery(params: TagsQueryParams = {}): string {
	const sp = new URLSearchParams();
	if (params.page) sp.set("page", String(params.page));
	if (params.search) sp.set("search", params.search);
	if (params.slug) sp.set("slug", params.slug);
	if (params.ordering) sp.set("ordering", params.ordering);
	const qs = sp.toString();
	return qs ? `${TAGS_BASE}?${qs}` : TAGS_BASE;
}

export async function listTags(
	params: TagsQueryParams = {},
): Promise<ApiResult<TagsListResponse>> {
	const url = buildQuery({ page: params.page ?? 1, ...params });

	const response = await apiFetch<TagsListResponse>(
		url,
		{
			method: "GET",
			next: { revalidate: 10 },
		},
		"reload",
	);

	return response;
}

export async function getTag(slug: string): Promise<ApiResult<Tag>> {
	const url = `${TAGS_BASE}${slug}/`;
	return apiFetch<Tag>(url, { method: "GET" });
}

/** ================================
 *  Create Tag (Admin only)
 *  ================================ */
export async function createTag(
	name: string,
	slug?: string,
): Promise<ApiResult<Tag>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "برای ایجاد تگ باید وارد شوید",
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
	console.log("🏷️ [createTag] Payload:", JSON.stringify(payload, null, 2));
	console.log("🏷️ [createTag] URL:", TAGS_BASE);
	console.log(
		"🏷️ [createTag] Token:",
		accessToken ? "✅ Present" : "❌ Missing",
	);

	const result = await apiFetch<Tag>(TAGS_BASE, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(payload),
	});

	console.log("🏷️ [createTag] Result:", JSON.stringify(result, null, 2));

	return result;
}

/** ================================
 *  Update Tag (Admin only)
 *  ================================ */
export async function updateTag(
	slug: string,
	name: string,
	newSlug?: string,
): Promise<ApiResult<Tag>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "برای ویرایش تگ باید وارد شوید",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `${TAGS_BASE}${slug}/`;

	// Include slug in payload if provided
	const payload = newSlug ? { name, slug: newSlug } : { name };

	console.log("🏷️ [updateTag] Slug:", slug);
	console.log("🏷️ [updateTag] Payload:", JSON.stringify(payload, null, 2));
	console.log("🏷️ [updateTag] URL:", url);

	const result = await apiFetch<Tag>(url, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(payload),
	});

	console.log("🏷️ [updateTag] Result:", JSON.stringify(result, null, 2));

	return result;
}

/** ================================
 *  Delete Tag (Admin only)
 *  ================================ */
export async function deleteTag(slug: string): Promise<ApiResult<null>> {
	const { accessToken } = await getSession();

	if (!accessToken) {
		return {
			success: false,
			message: "برای حذف تگ باید وارد شوید",
			statusCode: 401,
			type: "Unauthorized",
		};
	}

	const url = `${TAGS_BASE}${slug}/`;

	return apiFetch<null>(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
}
