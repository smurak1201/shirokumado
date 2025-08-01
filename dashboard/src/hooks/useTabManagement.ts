
/**
 * useTabManagement.ts
 *
 * タブ状態管理用カスタムフック。
 * ローカルストレージでタブ状態を永続化。
 *
 * 利用技術:
 * - useState, useCallback
 */

import { useState, useCallback } from "react";

/**
 * タブ管理のカスタムフック
 */
export const useTabManagement = () => {
  const [activeTab, setActiveTab] = useState<number>(() => {
    const saved = window.localStorage.getItem("activeTab");
    return saved !== null ? Number(saved) : 0;
  });

  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
    window.localStorage.setItem("activeTab", String(index));
  }, []);

  return {
    activeTab,
    handleTabChange,
  };
};
