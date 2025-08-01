/**
 * ImageSettings.tsx
 *
 * 画像設定画面の統合管理コンポーネント。
 * フィルター・検索・ページネーション・編集機能を一元管理。
 *
 * 主な機能:
 * - カテゴリー・タグ・公開状態による絞り込み
 * - タイトル検索による絞り込み
 * - ページネーション管理
 * - 画像編集・保存・削除
 * - 絞り込み結果の件数表示
 *
 * 利用技術:
 * - React関数コンポーネント
 * - useState, useCallback, useMemo
 * - カスタムフック（useSearchFilters, useImageFiltering, usePagination）
 */

// React本体
import React, { useState, useCallback, useMemo, useEffect } from "react";
// 画像メニュー型定義
import type { ImageItem } from "./ImageEditSection";
// UI コンポーネント群
import SearchFiltersComponent from "./SearchFilters";
import ImageSearch from "./ImageSearch";
import Pagination from "./Pagination";
import ImageEditSection from "./ImageEditSection";
// カスタムフック群
import { useSearchFilters } from "../hooks/useSearchFilters";
import { useImageFiltering } from "../hooks/useImageFiltering";
import { usePagination } from "../hooks/usePagination";

export type Props = {
    apiOrigin: string;
    editImages: ImageItem[];
    categoryList: { id: number; name: string }[];
    tagList: { id: number; name: string }[];
    onSave: (img: ImageItem) => Promise<void>;
    onDeleted: () => void;
};

const ImageSettings: React.FC<Props> = (props) => {
    const { apiOrigin, editImages, categoryList, tagList, onSave, onDeleted } =
        props;

    // 検索フィルター状態管理
    const {
        setSearchCategory,
        setSearchPublic,
        filters,
        resetFilters,
        updateTagFilter,
    } = useSearchFilters();

    // 画像絞り込み（カテゴリー・タグ・公開状態など）
    const { filteredImages } = useImageFiltering(editImages, filters);

    // 検索結果用のstate
    const [searchFilteredImages, setSearchFilteredImages] =
        useState<ImageItem[]>(filteredImages);

    // 最終的な表示対象画像（フィルター + 検索結果）
    const finalImages = useMemo(() => {
        // 検索が実行されている場合は検索結果、そうでなければフィルター結果を使用
        return searchFilteredImages;
    }, [searchFilteredImages]);

    // ページネーション管理
    const {
        currentPage: editPage,
        setCurrentPage: setEditPage,
        paginatedItems,
        resetPage,
    } = usePagination(finalImages, 10);

    // 検索結果変更ハンドラー
    const handleSearchResultsChange = useCallback(
        (searchResults: ImageItem[]) => {
            // 検索結果をフィルター済み画像から絞り込む
            const intersection = filteredImages.filter((img) =>
                searchResults.some((searchImg) => searchImg.id === img.id)
            );
            setSearchFilteredImages(intersection);
            resetPage(); // 検索時はページを1に戻す
        },
        [filteredImages, resetPage]
    );

    // フィルター変更時に検索結果をリセット
    useEffect(() => {
        setSearchFilteredImages(filteredImages);
    }, [filteredImages]);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-700">
                設定（画像編集）
            </h2>
            <p className="mb-2 text-sm text-gray-500">
                画像のタイトルやタグなどを編集できます。
            </p>

            {/* カテゴリー・タグ・公開状態フィルター */}
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

            {/* タイトル検索 */}
            <ImageSearch
                images={filteredImages}
                onSearchResultsChange={handleSearchResultsChange}
                placeholder="タイトルで検索"
            />

            {/* ページネーション */}
            <Pagination
                current={editPage}
                total={finalImages.length}
                pageSize={10}
                onChange={setEditPage}
            />

            {/* 画像編集セクション */}
            <ImageEditSection
                apiOrigin={apiOrigin}
                images={paginatedItems}
                categoryList={categoryList}
                tagList={tagList}
                onSave={onSave}
                onDeleted={onDeleted}
            />
        </div>
    );
};

export default ImageSettings;
