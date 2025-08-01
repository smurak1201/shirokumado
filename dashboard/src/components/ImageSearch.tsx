/**
 * ImageSearch.tsx
 *
 * 画像タイトル検索コンポーネント。
 * タイトルによる検索機能と文字列正規化を提供。
 *
 * 主な機能:
 * - タイトル検索入力フォーム
 * - 検索文字列の正規化（ひらがな・カタカナ・全角半角統一）
 * - 検索結果のフィルタリング
 * - 検索クリア機能
 *
 * 利用技術:
 * - React関数コンポーネント
 * - useState, useMemo, useCallback
 */

// React本体
import React, { useState, useMemo, useCallback } from "react";
// 画像メニュー型定義
import type { ImageItem } from "./ImageEditSection";

export type Props = {
    images: ImageItem[];
    onSearchResultsChange: (filteredImages: ImageItem[]) => void;
    placeholder?: string;
    className?: string;
};

/**
 * 文字列の正規化関数（ひらがな・カタカナ・英数字を統一）
 */
const normalize = (str: string): string => {
    return str
        .toLowerCase()
        .replace(/[ァ-ヶ]/g, (match) =>
            String.fromCharCode(match.charCodeAt(0) - 0x60)
        ) // カタカナ→ひらがな
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) =>
            String.fromCharCode(match.charCodeAt(0) - 0xfee0)
        ); // 全角英数→半角
};

const ImageSearch: React.FC<Props> = (props) => {
    const {
        images,
        onSearchResultsChange,
        placeholder = "タイトルで検索",
        className = "mb-4 flex items-center gap-2",
    } = props;

    const [searchTitle, setSearchTitle] = useState<string>("");

    // 検索結果のフィルタリング
    const filteredImages = useMemo(() => {
        if (!searchTitle.trim()) {
            return images;
        }

        return images.filter((img) => {
            return (
                typeof img.title === "string" &&
                normalize(img.title).includes(normalize(searchTitle))
            );
        });
    }, [images, searchTitle]);

    // 検索結果が変化したときに親コンポーネントに通知
    React.useEffect(() => {
        onSearchResultsChange(filteredImages);
    }, [filteredImages, onSearchResultsChange]);

    // 検索文字列変更ハンドラー
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTitle(e.target.value);
        },
        []
    );

    // 検索クリアハンドラー
    const handleClearSearch = useCallback(() => {
        setSearchTitle("");
    }, []);

    return (
        <div className={className}>
            <input
                type="text"
                inputMode="text"
                className="border rounded px-2 py-1 text-base w-full max-w-xs md:text-sm"
                style={{ fontSize: "16px" }}
                placeholder={placeholder}
                value={searchTitle}
                onChange={handleSearchChange}
            />
            {searchTitle && (
                <button
                    className="text-xs text-gray-500 px-2 py-1 border rounded whitespace-nowrap"
                    onClick={handleClearSearch}
                >
                    クリア
                </button>
            )}
        </div>
    );
};

export default ImageSearch;
