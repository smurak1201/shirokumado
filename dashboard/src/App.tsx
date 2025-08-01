/**
 * App.tsx
 *
 * 管理ダッシュボードのメイン画面。
 * 画像メニューの並び替え・編集・追加・検索・絞り込みなど、
 * 管理者向けの全機能をReactで実装。
 *
 * 主な構成:
 * - タブUI（並び替え/編集/追加）
 * - 画像データ取得・管理
 * - カスタムフックによる状態・ロジック分離
 * - 各種UIコンポーネントの組み合わせ
 *
 * 利用技術:
 * - React関数コンポーネント
 * - useState, useEffect, useCallback
 * - カスタムフック（useMenuManagement, useSearchFilters等）
 * - ドラッグ＆ドロップ（@hello-pangea/dnd）
 */

// React本体からフックをimport（状態・副作用・コールバック管理）
import { useEffect, useState, useCallback } from "react";
// 画像メニュー型定義（編集・追加・並び替えで使用）
import type { ImageItem } from "./components/ImageEditSection";
// DnD（ドラッグ＆ドロップ）用ライブラリ
import { DragDropContext } from "@hello-pangea/dnd";
// メニュー表示・並び替えセクション
import MenuSection from "./MenuSection";
// 画像設定セクション（統合）
import ImageSettings from "./components/ImageSettings";
// 画像追加フォーム
import ImageAddForm from "./components/ImageAddForm";
// ページネーションUI
// タブ定数（ラベル・インデックス）
import { TAB_INDICES, TAB_LABELS } from "./constants/tags";
// 検索フィルター管理フック
// 画像絞り込みロジックフック
// 画像API操作フック
import { useImageApi } from "./hooks/useImageApi";
// カテゴリー・タグ取得フック
import { useCategoryTags } from "./hooks/useCategoryTags";
// メニュー並び替え・DnD管理フック
import { useMenuManagement } from "./hooks/useMenuManagement";
// タブ状態管理フック
import { useTabManagement } from "./hooks/useTabManagement";
// ページネーション管理フック
// 検索フィルターUIコンポーネント

function App() {
    // APIのベースURL（環境変数から取得）
    const apiOrigin = import.meta.env.VITE_API_ORIGIN;

    // 画像データ管理（全画像一覧を保持）
    const [editImages, setEditImages] = useState<ImageItem[]>([]);

    // 画像データ取得関数（useCallbackでメモ化）
    // APIから画像一覧を取得し、editImagesにセット
    const fetchImages = useCallback(async () => {
        const res = await fetch(`${apiOrigin}/api/images`);
        if (res.ok) {
            const data = await res.json();
            setEditImages(data);
        }
    }, [apiOrigin]);

    // タブ状態管理（並び替え/編集/追加）
    const { activeTab, handleTabChange } = useTabManagement();
    // カテゴリー・タグ一覧取得
    const { categoryList, tagList } = useCategoryTags(apiOrigin);
    // 画像API操作（保存・削除）
    const { saveImage, handleImageDeleted } = useImageApi(
        apiOrigin,
        fetchImages
    );
    // 検索フィルター状態管理
    // 画像絞り込み（検索・タグ・公開状態など）
    // メニュー並び替え・DnD管理
    const { menuData, createSortHandler, updateDisplayOrder, handleDragEnd } =
        useMenuManagement(editImages, apiOrigin);

    // 初回マウント時に画像一覧を取得
    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    return (
        <main className="w-full max-w-xl mx-auto px-2 sm:px-4 py-8 min-h-[900px]">
            {/* タブUI */}
            <div className="flex justify-center">
                <div className="flex">
                    {TAB_LABELS.map((label, idx) => (
                        <button
                            key={label}
                            type="button"
                            className={`w-32 px-6 py-2 text-sm font-semibold mx-1 focus:outline-none transition-all duration-150 border-b-2
                                ${
                                    activeTab === idx
                                        ? "text-blue-600 border-blue-600"
                                        : "text-gray-500 border-transparent"
                                }
                            `}
                            style={{ background: "none" }}
                            onClick={() => handleTabChange(idx)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* タブごとの画面 */}
            {activeTab === TAB_INDICES.ARRANGEMENT && (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex flex-row gap-4">
                        <MenuSection
                            title="限定メニュー"
                            items={menuData.limitedMenu.items}
                            apiOrigin={apiOrigin}
                            droppableId="limitedMenu"
                            droppableType="limited"
                            sortAsc={menuData.limitedMenu.isAsc}
                            onToggleSort={createSortHandler("limitedMenu")}
                            onRegisterOrder={async () =>
                                await updateDisplayOrder("limitedMenu", true)
                            }
                        />
                        <MenuSection
                            title="通常メニュー"
                            items={menuData.normalMenu.items}
                            apiOrigin={apiOrigin}
                            droppableId="normalMenu"
                            droppableType="normal"
                            sortAsc={menuData.normalMenu.isAsc}
                            onToggleSort={createSortHandler("normalMenu")}
                            onRegisterOrder={async () =>
                                await updateDisplayOrder("normalMenu", true)
                            }
                        />
                        <MenuSection
                            title="サイドメニュー"
                            items={menuData.sideMenu.items}
                            apiOrigin={apiOrigin}
                            droppableId="sideMenu"
                            droppableType="side"
                            sortAsc={menuData.sideMenu.isAsc}
                            onToggleSort={createSortHandler("sideMenu")}
                            onRegisterOrder={async () =>
                                await updateDisplayOrder("sideMenu", true)
                            }
                        />
                    </div>
                </DragDropContext>
            )}
            {activeTab === TAB_INDICES.SETTINGS && (
                <ImageSettings
                    apiOrigin={apiOrigin}
                    editImages={editImages}
                    categoryList={categoryList}
                    tagList={tagList}
                    onSave={saveImage}
                    onDeleted={handleImageDeleted}
                />
            )}
            {activeTab === TAB_INDICES.ADD && (
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">
                        追加
                    </h2>
                    <p className="mb-2 text-sm text-gray-500">
                        新しい画像を登録できます。
                    </p>
                    <ImageAddForm
                        apiOrigin={apiOrigin}
                        categoryList={categoryList}
                        tagList={tagList}
                        onAdded={fetchImages}
                    />
                </div>
            )}
        </main>
    );
}

export default App;
