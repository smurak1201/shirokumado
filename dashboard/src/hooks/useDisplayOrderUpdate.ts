
/**
 * useDisplayOrderUpdate.ts
 *
 * 並び順をDBに保存するカスタムフック。
 * メニュー並び替え時に利用。
 *
 * 利用技術:
 * - useCallback
 */

import { useCallback } from "react";

/**
 * 並び順をDBに更新するカスタムフック
 */
export const useDisplayOrderUpdate = (apiOrigin: string) => {
  const updateDisplayOrder = useCallback(
    async (
      items: Array<{ id: number }>,
      showAlert: boolean = true
    ) => {
      const payload = items.map((item, idx) => ({
        id: item.id,
        display_order: idx + 1,
      }));

      try {
        const res = await fetch(`${apiOrigin}/api/images/display-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orders: payload }),
        });

        if (!res.ok) throw new Error("DB更新に失敗しました");
        if (showAlert) alert("並び順を保存しました");
      } catch (e) {
        if (showAlert) alert("DB更新に失敗しました");
      }
    },
    [apiOrigin]
  );

  return { updateDisplayOrder };
};
