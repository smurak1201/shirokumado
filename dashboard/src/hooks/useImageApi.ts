import { useCallback } from "react";
import type { ImageItem } from "../components/ImageEditSection";

/**
 * 画像API操作のカスタムフック
 */
export const useImageApi = (apiOrigin: string, onSuccess: () => void) => {
  const saveImage = useCallback(
    async (img: ImageItem) => {
      try {
        const res = await fetch(`${apiOrigin}/api/images/${img.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(img),
        });

        if (!res.ok) throw new Error("保存に失敗しました");

        await onSuccess();
        alert("保存しました");
      } catch (e: any) {
        alert(e.message || "保存に失敗しました");
      }
    },
    [apiOrigin, onSuccess]
  );

  const handleImageDeleted = useCallback(async () => {
    await onSuccess();
  }, [onSuccess]);

  return {
    saveImage,
    handleImageDeleted,
  };
};
