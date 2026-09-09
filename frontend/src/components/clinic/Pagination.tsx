"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	page: number;
	hasNext: boolean;
	hasPrevious: boolean;
	onPageChange: (page: number) => void;
}

function Pagination({
	page,
	hasNext,
	hasPrevious,
	onPageChange,
}: PaginationProps) {
	if (!hasNext && !hasPrevious) return null;

	return (
		<div className="flex items-center justify-center gap-4 mt-8">
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(page - 1)}
				disabled={!hasPrevious}>
				<ChevronRight className="size-4" />
			</Button>

			<span className="text-sm">صفحه {page}</span>

			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(page + 1)}
				disabled={!hasNext}>
				<ChevronLeft className="size-4" />
			</Button>
		</div>
	);
}

export default Pagination;
