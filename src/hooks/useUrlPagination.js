"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useUrlPagination(
  defaultLimit = 20,
  allowedLimits = [10, 20, 50, 100],
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = parseInt(searchParams.get("page"), 10);
  const limitParam = parseInt(searchParams.get("limit"), 10);

  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const currentLimit = allowedLimits.includes(limitParam)
    ? limitParam
    : defaultLimit;

  const updatePaginationParams = useCallback(
    (newPage, newLimit) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      params.set("limit", String(newLimit || currentLimit));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, currentLimit, pathname, router],
  );

  const resetPageToFirst = useCallback(() => {
    if (currentPage !== 1) {
      updatePaginationParams(1, currentLimit);
    }
  }, [currentPage, currentLimit, updatePaginationParams]);

  return {
    currentPage,
    currentLimit,
    updatePaginationParams,
    resetPageToFirst,
  };
}

export default useUrlPagination;
