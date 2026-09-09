"use client";

import Pagination from "@/components/clinic/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function PaginationControls({ page, hasNext, hasPrevious }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  function onPageChange(nextPage: number) {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(nextPage));
    router.push(`/articles?${params.toString()}`);
  }

  return (
    <Pagination
      page={page}
      hasNext={hasNext}
      hasPrevious={hasPrevious}
      onPageChange={onPageChange}
    />
  );
}
