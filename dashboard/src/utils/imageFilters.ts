import type { ImageItem } from "../components/ImageEditSection";
import { TAG_IDS, CATEGORY_NAMES } from "../constants/tags";

/**
 * タグが特定のIDを含むかチェック
 */
export const hasTag = (tags: ImageItem["tags"], tagId: number): boolean => {
  if (!Array.isArray(tags)) return false;

  return tags.some((t) =>
    (typeof t === "number" && t === tagId) ||
    (typeof t === "object" && "id" in t && t.id === tagId)
  );
};

/**
 * 画像フィルタリング関数
 */
export const filterImages = {
  /**
   * 公開画像のみ抽出
   */
  publicOnly: (images: ImageItem[]): ImageItem[] =>
    images.filter(
      (img) => String(img.is_public) === "1" || img.is_public === true
    ),

  /**
   * 限定メニューのみ抽出
   */
  limitedMenu: (images: ImageItem[]): ImageItem[] =>
    images.filter((img) => hasTag(img.tags, TAG_IDS.LIMITED_MENU)),

  /**
   * 通常メニューのみ抽出
   */
  normalMenu: (images: ImageItem[]): ImageItem[] =>
    images.filter((img) => hasTag(img.tags, TAG_IDS.NORMAL_MENU)),

  /**
   * サイドメニューのみ抽出
   */
  sideMenu: (images: ImageItem[]): ImageItem[] =>
    images.filter((img) => img.category_name === CATEGORY_NAMES.SIDE_MENU),
};
