/**
 * tags.ts
 *
 * タグ・カテゴリー・タブの定数定義ファイル。
 * 画面表示やフィルタリングで利用。
 */

// タグIDの定数定義
export const TAG_IDS = {
  NORMAL_MENU: 1,
  LIMITED_MENU: 2,
} as const;

// カテゴリ名の定数定義
export const CATEGORY_NAMES = {
  SIDE_MENU: "サイドメニュー",
} as const;

// タブの定数定義
export const TAB_INDICES = {
  ARRANGEMENT: 0,
  SETTINGS: 1,
  ADD: 2,
} as const;

export const TAB_LABELS = ["配置登録", "設定", "追加"] as const;
