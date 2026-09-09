"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9] w-full bg-muted/40" />
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
}
