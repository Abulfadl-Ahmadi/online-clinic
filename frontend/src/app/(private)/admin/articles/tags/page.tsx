"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listTags, deleteTag } from "@/actions";
import { Tag } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Edit, Plus } from "lucide-react";

export default function AdminTagsPage() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);

	async function loadTags() {
		setLoading(true);
		const res = await listTags({ ordering: "name" });
		if (res.success) {
			setTags(res.data.results);
		} else {
			toast.error("خطا در بارگذاری تگ‌ها");
		}
		setLoading(false);
	}

	async function handleDelete(slug: string, name: string) {
		if (!confirm(`آیا از حذف تگ "${name}" مطمئن هستید؟`)) {
			return;
		}

		const res = await deleteTag(slug);
		if (res.success) {
			toast.success("تگ با موفقیت حذف شد");
			loadTags();
		} else {
			toast.error(res.message || "خطا در حذف تگ");
		}
	}

	useEffect(() => {
		loadTags();
	}, []);

	if (loading) {
		return <div className="text-center py-8">در حال بارگذاری...</div>;
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">مدیریت تگ‌ها</h1>
				<Button asChild>
					<Link href="/admin/articles/tags/new">
						<Plus className="size-4 me-2" />
						تگ جدید
					</Link>
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{tags.map((tag) => (
					<Card key={tag.id}>
						<CardHeader>
							<CardTitle className="text-lg">
								{tag.name}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-2">
								<p className="text-sm text-muted-foreground">
									شناسه (نامک):{" "}
									<code className="bg-muted px-1 rounded">
										{tag.slug}
									</code>
								</p>
								<div className="flex gap-2">
									<Button
										asChild
										variant="outline"
										size="sm"
										className="flex-1">
										<Link
											href={`/admin/articles/tags/${tag.slug}`}>
											<Edit className="size-3.5 me-1" />
											ویرایش
										</Link>
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() =>
											handleDelete(tag.slug, tag.name)
										}>
										<Trash2 className="size-3.5" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{tags.length === 0 && (
				<div className="text-center py-8 text-muted-foreground">
					هیچ تگی یافت نشد
				</div>
			)}
		</div>
	);
}
