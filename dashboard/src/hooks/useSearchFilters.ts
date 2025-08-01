
/**
 * useSearchFilters.ts
 *
 * 検索・絞り込み状態管理用カスタムフック。
 * カテゴリー・タグ・公開状態の選択・リセット。
 *
 * 利用技術:
 * - useState, useMemo, useCallback
 */

import { useState, useMemo, useCallback } from "react";

export type SearchFilters = {
  category: string;
  isPublic: string;
  tags: number[];
};

/**
 * 検索フィルター用のカスタムフック
 */
export const useSearchFilters = () => {
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [searchPublic, setSearchPublic] = useState<string>("");
  const [searchTags, setSearchTags] = useState<number[]>([]);

  const filters: SearchFilters = useMemo(
    () => ({
      category: searchCategory,
      isPublic: searchPublic,
      tags: searchTags,
    }),
    [searchCategory, searchPublic, searchTags]
  );

  const resetFilters = useCallback(() => {
    setSearchCategory("");
    setSearchPublic("");
    setSearchTags([]);
  }, []);

  const updateTagFilter = useCallback((tagId: number, checked: boolean) => {
    setSearchTags((prev) =>
      checked
        ? [...prev, tagId]
        : prev.filter((tid) => tid !== tagId)
    );
  }, []);

  return {
    searchCategory,
    searchPublic,
    searchTags,
    setSearchCategory,
    setSearchPublic,
    setSearchTags,
    filters,
    resetFilters,
    updateTagFilter,
  };
};
