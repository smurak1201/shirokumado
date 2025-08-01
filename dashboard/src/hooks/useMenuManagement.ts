
/**
 * useMenuManagement.ts
 *
 * 画像メニューの並び替え・DnD・DB保存を一括管理するカスタムフック。
 * useMemo, useCallbackでパフォーマンス最適化。
 *
 * 利用技術:
 * - useState, useEffect, useCallback, useMemo
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import type { ImageItem } from "../components/ImageEditSection";
import { filterImages } from "../utils/imageFilters";

type MenuType = "limitedMenu" | "normalMenu" | "sideMenu";

/**
 * メニュー管理のカスタムフック
 */
export const useMenuManagement = (editImages: ImageItem[], apiOrigin: string) => {
  const [limitedMenu, setLimitedMenu] = useState<ImageItem[]>([]);
  const [normalMenu, setNormalMenu] = useState<ImageItem[]>([]);
  const [sideMenu, setSideMenu] = useState<ImageItem[]>([]);

  const [limitedAsc, setLimitedAsc] = useState<boolean>(true);
  const [normalAsc, setNormalAsc] = useState<boolean>(true);
  const [sideAsc, setSideAsc] = useState<boolean>(true);

  // メニューのsetter関数のマップ
  const menuSetters = useMemo(() => ({
    limitedMenu: setLimitedMenu,
    normalMenu: setNormalMenu,
    sideMenu: setSideMenu,
  }), []);

  // メニューデータのマップ
  const menuData = useMemo(() => ({
    limitedMenu: { items: limitedMenu, isAsc: limitedAsc, setAsc: setLimitedAsc },
    normalMenu: { items: normalMenu, isAsc: normalAsc, setAsc: setNormalAsc },
    sideMenu: { items: sideMenu, isAsc: sideAsc, setAsc: setSideAsc },
  }), [limitedMenu, normalMenu, sideMenu, limitedAsc, normalAsc, sideAsc]);

  // 並び替えハンドラーの生成
  const createSortHandler = useCallback((menuType: MenuType) => {
    return () => {
      const { items, isAsc, setAsc } = menuData[menuType];
      const setter = menuSetters[menuType];

      setter(
        isAsc
          ? [...items].sort((a, b) => b.id - a.id)
          : [...items].sort((a, b) => a.id - b.id)
      );
      setAsc(!isAsc);
    };
  }, [menuData, menuSetters]);

  // 並び順をDBに登録する関数
  const updateDisplayOrder = useCallback(async (
    menuType: MenuType,
    showAlert: boolean = true
  ) => {
    const items = menuData[menuType].items;
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
  }, [menuData, apiOrigin]);

  // DnD処理
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const menuType = source.droppableId as MenuType;

    if (!menuSetters[menuType]) return;

    const items = Array.from(menuData[menuType].items);
    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);
    menuSetters[menuType](items);
  }, [menuData, menuSetters]);

  // editImagesが変化したら各メニューstateを再計算
  useEffect(() => {
    const publicImages = filterImages.publicOnly(editImages);
    setLimitedMenu(filterImages.limitedMenu(publicImages));
    setNormalMenu(filterImages.normalMenu(publicImages));
    setSideMenu(filterImages.sideMenu(publicImages));
  }, [editImages]);

  // 並び順自動登録
  useEffect(() => {
    const autoUpdate = async () => {
      const updates = Object.entries(menuData).map(([menuType, data]) => {
        if (data.items.length > 0) {
          return updateDisplayOrder(menuType as MenuType, false);
        }
        return Promise.resolve();
      });
      await Promise.all(updates);
    };

    autoUpdate();
  }, [limitedMenu, normalMenu, sideMenu]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    menuData,
    createSortHandler,
    updateDisplayOrder,
    handleDragEnd,
  };
};
