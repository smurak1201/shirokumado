import { useMemo } from "react";
import type { ImageItem } from "../components/ImageEditSection";
import type { SearchFilters } from "../hooks/useSearchFilters";

/**
 * 画像フィルタリング用のカスタムフック
 */
export const useImageFiltering = (
  images: ImageItem[],
  filters: SearchFilters
) => {
  const filteredImages = useMemo(() => {
    let filtered = images;

    if (filters.category) {
      filtered = filtered.filter(
        (img) => String(img.category_id) === filters.category
      );
    }

    if (filters.isPublic) {
      filtered = filtered.filter(
        (img) => String(img.is_public) === filters.isPublic
      );
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(
        (img) =>
          Array.isArray(img.tags) &&
          img.tags !== undefined &&
          filters.tags.every((tid) =>
            (img.tags as number[]).includes(tid)
          )
      );
    }

    return filtered;
  }, [images, filters]);

  return { filteredImages };
};
