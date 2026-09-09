import { Badge } from "@/components/ui/badge";

interface TagChipProps {
	tag: string;
	/** Persian display name; falls back to the slug when not provided */
	name?: string;
}

export default function TagChip({ tag, name }: TagChipProps) {
	return <Badge variant="outline">#{name || tag}</Badge>;
}
