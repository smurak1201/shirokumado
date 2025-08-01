
/**
 * usePagination.ts
 *
 * ページネーション管理用カスタムフック。
 * 一覧表示のページ切り替え・件数管理。
 *
 * 利用技術:
 * - useState, useCallback, useMemo
 */

import { useState, useCallback, useMemo } from "react";

/**
 * ページネーション管理のカスタムフック
 */
export const usePagination = <T>(items: T[], pageSize: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const startIndex = pageSize * (currentPage - 1);
    const endIndex = pageSize * currentPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, pageSize]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    resetPage,
    totalItems: items.length,
  };
};
