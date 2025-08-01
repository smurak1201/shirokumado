
/**
 * useCategoryTags.ts
 *
 * カテゴリー・タグ一覧をAPIから取得するカスタムフック。
 * 画面表示や検索UIで利用。
 *
 * 利用技術:
 * - useState, useEffect
 */

import { useState, useEffect } from "react";

/**
 * カテゴリとタグのデータを取得するカスタムフック
 */
export const useCategoryTags = (apiOrigin: string) => {
  const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
  const [tagList, setTagList] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch(`${apiOrigin}/api/categories`),
          fetch(`${apiOrigin}/api/tags`)
        ]);

        const categories = categoriesRes.ok ? await categoriesRes.json() : [];
        const tags = tagsRes.ok ? await tagsRes.json() : [];

        setCategoryList(categories);
        setTagList(tags);
      } catch {
        setCategoryList([]);
        setTagList([]);
      }
    };

    fetchCategoriesAndTags();
  }, [apiOrigin]);

  return { categoryList, tagList };
};
