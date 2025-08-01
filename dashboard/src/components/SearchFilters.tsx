import React, { useCallback } from "react";
import type { SearchFilters } from "../hooks/useSearchFilters";

interface Props {
    categoryList: { id: number; name: string }[];
    tagList: { id: number; name: string }[];
    filters: SearchFilters;
    onCategoryChange: (value: string) => void;
    onPublicChange: (value: string) => void;
    onTagChange: (tagId: number, checked: boolean) => void;
    onReset: () => void;
    onPageReset: () => void;
}

/**
 * 検索フィルターUI コンポーネント
 */
const SearchFiltersComponent: React.FC<Props> = React.memo(
    ({
        categoryList,
        tagList,
        filters,
        onCategoryChange,
        onPublicChange,
        onTagChange,
        onReset,
        onPageReset,
    }) => {
        const handleCategoryChange = useCallback(
            (e: React.ChangeEvent<HTMLSelectElement>) => {
                onCategoryChange(e.target.value);
                onPageReset();
            },
            [onCategoryChange, onPageReset]
        );

        const handlePublicChange = useCallback(
            (e: React.ChangeEvent<HTMLSelectElement>) => {
                onPublicChange(e.target.value);
                onPageReset();
            },
            [onPublicChange, onPageReset]
        );

        const handleTagChange = useCallback(
            (tagId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
                onPageReset();
                onTagChange(tagId, e.target.checked);
            },
            [onTagChange, onPageReset]
        );

        const handleResetFilters = useCallback(() => {
            onReset();
            onPageReset();
        }, [onReset, onPageReset]);
        return (
            <form className="flex flex-wrap gap-4 mb-4 items-end">
                <div>
                    <label className="text-xs text-gray-500">カテゴリー</label>
                    <select
                        className="w-32 px-2 py-1 border rounded"
                        value={filters.category}
                        onChange={handleCategoryChange}
                    >
                        <option value="">すべて</option>
                        {categoryList.map((cat) => (
                            <option key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-xs text-gray-500">公開状態</label>
                    <select
                        className="w-24 px-2 py-1 border rounded"
                        value={filters.isPublic}
                        onChange={handlePublicChange}
                    >
                        <option value="">すべて</option>
                        <option value="1">公開</option>
                        <option value="0">非公開</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs text-gray-500">タグ</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {tagList.map((tag) => (
                            <label
                                key={tag.id}
                                className="flex items-center gap-1"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.tags.includes(tag.id)}
                                    onChange={handleTagChange(tag.id)}
                                />
                                <span>{tag.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    className="px-3 py-1 bg-gray-200 rounded text-sm"
                    onClick={handleResetFilters}
                >
                    リセット
                </button>
            </form>
        );
    }
);

export default SearchFiltersComponent;
