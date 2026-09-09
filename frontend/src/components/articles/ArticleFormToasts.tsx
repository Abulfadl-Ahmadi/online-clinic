"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ArticleFormToasts() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const created = searchParams.get("created");
    const error = searchParams.get("error");
    
    if (created === "true") {
      toast.success("مقاله با موفقیت ایجاد شد!");
    }
    
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams]);
  
  return null;
}
