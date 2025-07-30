import React, { useState, useEffect } from "react";

export type ImageItem = {
    id: number;
    title: string;
    file_path: string;
    display_order?: number | null;
    alt_text?: string;
    tag_name?: string;
    category_name?: string;
    category_id?: number | null;
    caption?: string;
    price_s?: number | null;
    price_l?: number | null;
    price_other?: number | null;
    tags?: number[];
    is_public?: boolean;
    start_at?: string;
    end_at?: string;
};

export type Tag = { id: number; name: string };

interface Props {
    apiOrigin: string;
    images: ImageItem[];
    categoryList: { id: number; name: string }[];
    onSave: (img: ImageItem) => Promise<void>;
}

const ImageEditSection: React.FC<Props> = ({
    apiOrigin,
    images,
    categoryList,
    onSave,
}) => {
    const [editImages, setEditImages] = useState<ImageItem[]>(images);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    // categoryListをpropsから受け取る
    // ...existing code...

    useEffect(() => {
        setEditImages(images);
    }, [images]);

    const handleEditSave = async (img: ImageItem) => {
        setEditLoading(true);
        setEditError("");
        // 数値項目の型補正（個別プロパティごと）
        const cleanImg = { ...img };
        if (typeof cleanImg.price_s === "string" && cleanImg.price_s === "")
            cleanImg.price_s = null;
        if (typeof cleanImg.price_s === "string" && cleanImg.price_s !== null)
            cleanImg.price_s = Number(cleanImg.price_s);

        if (typeof cleanImg.price_l === "string" && cleanImg.price_l === "")
            cleanImg.price_l = null;
        if (typeof cleanImg.price_l === "string" && cleanImg.price_l !== null)
            cleanImg.price_l = Number(cleanImg.price_l);

        if (
            typeof cleanImg.price_other === "string" &&
            cleanImg.price_other === ""
        )
            cleanImg.price_other = null;
        if (
            typeof cleanImg.price_other === "string" &&
            cleanImg.price_other !== null
        )
            cleanImg.price_other = Number(cleanImg.price_other);

        if (
            typeof cleanImg.display_order === "string" &&
            cleanImg.display_order === ""
        )
            cleanImg.display_order = null;
        if (
            typeof cleanImg.display_order === "string" &&
            cleanImg.display_order !== null
        )
            cleanImg.display_order = Number(cleanImg.display_order);

        try {
            await onSave(cleanImg);
        } catch (e: any) {
            setEditError(e.message || "保存に失敗しました");
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {editError && <div className="text-red-500 mb-2">{editError}</div>}
            {editLoading && <div className="text-blue-500 mb-2">保存中...</div>}
            {editImages.map((img, idx) => {
                const isCategorySelected = !!img.category_id;
                return (
                    <form
                        key={img.id}
                        className="border rounded-xl p-4 bg-gray-50"
                    >
                        <div className="flex gap-4 items-center">
                            <img
                                src={`${apiOrigin}/images/${img.file_path}`}
                                alt={img.alt_text || img.title}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1 flex flex-col gap-2">
                                <label className="text-xs text-gray-500">
                                    カテゴリー（必須）
                                    <select
                                        className="border px-2 py-1 rounded w-full"
                                        value={img.category_id ?? ""}
                                        onChange={(e) => {
                                            const val =
                                                e.target.value === ""
                                                    ? null
                                                    : Number(e.target.value);
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    category_id: val,
                                                };
                                                return next;
                                            });
                                        }}
                                        required
                                    >
                                        <option value="">
                                            選択してください
                                        </option>
                                        {categoryList.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="text-xs text-gray-500">
                                    タイトル
                                    <input
                                        type="text"
                                        className="border px-2 py-1 rounded w-full"
                                        value={img.title || ""}
                                        onChange={(e) => {
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    title: e.target.value,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-xs text-gray-500">
                                    説明
                                    <input
                                        type="text"
                                        className="border px-2 py-1 rounded w-full"
                                        value={img.caption || ""}
                                        onChange={(e) => {
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    caption: e.target.value,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-xs text-gray-500">
                                    Sサイズ金額
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-full"
                                        value={img.price_s ?? ""}
                                        onChange={(e) => {
                                            const val =
                                                e.target.value === ""
                                                    ? null
                                                    : Number(e.target.value);
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    price_s: val,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-xs text-gray-500">
                                    Lサイズ金額
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-full"
                                        value={img.price_l ?? ""}
                                        onChange={(e) => {
                                            const val =
                                                e.target.value === ""
                                                    ? null
                                                    : Number(e.target.value);
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    price_l: val,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-xs text-gray-500">
                                    その他サイズ金額
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-full"
                                        value={img.price_other ?? ""}
                                        onChange={(e) => {
                                            const val =
                                                e.target.value === ""
                                                    ? null
                                                    : Number(e.target.value);
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    price_other: val,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-xs text-gray-500">
                                    公開
                                    <input
                                        type="checkbox"
                                        checked={!!img.is_public}
                                        onChange={(e) => {
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    is_public: e.target.checked,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-xs text-gray-500">
                                    表示順
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-full"
                                        value={img.display_order ?? ""}
                                        onChange={(e) => {
                                            const val =
                                                e.target.value === ""
                                                    ? null
                                                    : Number(e.target.value);
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    display_order: val,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-xs text-gray-500">
                                    公開開始
                                    <input
                                        type="datetime-local"
                                        className="border px-2 py-1 rounded w-full"
                                        value={
                                            img.start_at
                                                ? img.start_at.substring(0, 16)
                                                : ""
                                        }
                                        onChange={(e) => {
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    start_at: e.target.value,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-xs text-gray-500">
                                    公開終了
                                    <input
                                        type="datetime-local"
                                        className="border px-2 py-1 rounded w-full"
                                        value={
                                            img.end_at
                                                ? img.end_at.substring(0, 16)
                                                : ""
                                        }
                                        onChange={(e) => {
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    end_at: e.target.value,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-xs text-gray-500">
                                    タグ
                                    <input
                                        type="text"
                                        className="border px-2 py-1 rounded w-full"
                                        value={
                                            Array.isArray(img.tags)
                                                ? img.tags.join(",")
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const tags = e.target.value
                                                .split(",")
                                                .map((v) => v.trim())
                                                .filter((v) => v !== "")
                                                .map(Number)
                                                .filter((v) => !isNaN(v));
                                            setEditImages((prev) => {
                                                const next = [...prev];
                                                next[idx] = {
                                                    ...next[idx],
                                                    tags,
                                                };
                                                return next;
                                            });
                                        }}
                                    />
                                </label>
                            </div>
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                disabled={!isCategorySelected}
                                onClick={() => handleEditSave(editImages[idx])}
                            >
                                保存
                            </button>
                        </div>
                    </form>
                );
            })}
        </div>
    );
};

export default ImageEditSection;
