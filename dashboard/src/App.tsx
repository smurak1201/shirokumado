import { useEffect, useState, useCallback } from "react";
import type { ImageItem } from "./components/ImageEditSection";
import { DragDropContext } from "@hello-pangea/dnd";
import MenuSection from "./MenuSection";
import ImageEditSection from "./components/ImageEditSection";
import ImageAddForm from "./components/ImageAddForm";
import Pagination from "./components/Pagination";
import { TAB_INDICES, TAB_LABELS } from "./constants/tags";
import { useSearchFilters } from "./hooks/useSearchFilters";
import { useImageFiltering } from "./hooks/useImageFiltering";
import { useImageApi } from "./hooks/useImageApi";
import { useCategoryTags } from "./hooks/useCategoryTags";
import { useMenuManagement } from "./hooks/useMenuManagement";
import { useTabManagement } from "./hooks/useTabManagement";
import { usePagination } from "./hooks/usePagination";
import SearchFiltersComponent from "./components/SearchFilters";

function App() {
    const apiOrigin = import.meta.env.VITE_API_ORIGIN;

    // 画像データ管理
    const [editImages, setEditImages] = useState<ImageItem[]>([]);

    // 画像データ取得（メモ化）
    const fetchImages = useCallback(async () => {
        const res = await fetch(`${apiOrigin}/api/images`);
        if (res.ok) {
            const data = await res.json();
            setEditImages(data);
        }
    }, [apiOrigin]);

    // カスタムフック群
    const { activeTab, handleTabChange } = useTabManagement();
    const { categoryList, tagList } = useCategoryTags(apiOrigin);
    const { saveImage, handleImageDeleted } = useImageApi(
        apiOrigin,
        fetchImages
    );
    const {
        setSearchCategory,
        setSearchPublic,
        filters,
        resetFilters,
        updateTagFilter,
    } = useSearchFilters();
    const { filteredImages } = useImageFiltering(editImages, filters);
    const { menuData, createSortHandler, updateDisplayOrder, handleDragEnd } =
        useMenuManagement(editImages, apiOrigin);
    const {
        currentPage: editPage,
        setCurrentPage: setEditPage,
        paginatedItems,
        resetPage,
    } = usePagination(filteredImages, 10);
    // 初回データ取得
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
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">
                        設定（画像編集）
                    </h2>
                    <p className="mb-2 text-sm text-gray-500">
                        画像のタイトルやタグなどを編集できます。
                    </p>
                    <SearchFiltersComponent
                        categoryList={categoryList}
                        tagList={tagList}
                        filters={filters}
                        onCategoryChange={setSearchCategory}
                        onPublicChange={setSearchPublic}
                        onTagChange={updateTagFilter}
                        onReset={resetFilters}
                        onPageReset={resetPage}
                    />
                    <Pagination
                        current={editPage}
                        total={filteredImages.length}
                        pageSize={10}
                        onChange={setEditPage}
                    />
                    <ImageEditSection
                        apiOrigin={apiOrigin}
                        images={paginatedItems}
                        categoryList={categoryList}
                        tagList={tagList}
                        onSave={saveImage}
                        onDeleted={handleImageDeleted}
                    />
                </div>
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
