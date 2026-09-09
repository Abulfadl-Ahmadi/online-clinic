import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
	slug: string;
	/** Persian display name; falls back to the slug when not provided */
	name?: string;
}

export default function CategoryBadge({ slug, name }: CategoryBadgeProps) {
	return (
		<Badge variant="secondary">
			{name || slug}
		</Badge>
	);
}
