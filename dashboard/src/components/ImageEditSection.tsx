import React, { useState, useEffect } from "react";

export type ImageItem = {
    id: number;
    title: string;
    file_path: string;
    display_order?: number | null;
    alt_text?: string;
    tag_name?: string;
    category_name?: string;
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
    tagList: Tag[];
    onSave: (img: ImageItem) => Promise<void>;
}

const ImageEditSection: React.FC<Props> = ({
    apiOrigin,
    images,
    tagList,
    onSave,
}) => {
    const [editImages, setEditImages] = useState<ImageItem[]>(images);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    useEffect(() => {
        setEditImages(images);
    }, [images]);

    const handleEditChange = (
        idx: number,
        key: keyof ImageItem,
        value: any
    ) => {
        setEditImages((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], [key]: value };
            return next;
        });
    };

    const handleTagChange = (idx: number, tagId: number, checked: boolean) => {
        setEditImages((prev) => {
            const next = [...prev];
            let tags = Array.isArray(next[idx].tags) ? next[idx].tags : [];
            if (checked) {
                tags = [...tags, tagId];
            } else {
                tags = tags.filter((id) => id !== tagId);
            }
            next[idx] = { ...next[idx], tags };
            return next;
        });
    };

    const handleEditSave = async (img: ImageItem) => {
        setEditLoading(true);
        setEditError("");
        try {
            await onSave(img);
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
            {editImages.map((img, idx) => (
                <form key={img.id} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex gap-4 items-center">
                        <img
                            src={`${apiOrigin}/images/${img.file_path}`}
                            alt={img.alt_text || img.title}
                            className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-xs text-gray-500">
                                タイトル
                                <input
                                    type="text"
                                    className="border px-2 py-1 rounded w-full"
                                    value={img.title || ""}
                                    onChange={(e) =>
                                        handleEditChange(
                                            idx,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                            <label className="text-xs text-gray-500">
                                説明
                                <input
                                    type="text"
                                    className="border px-2 py-1 rounded w-full"
                                    value={img.caption || ""}
                                    onChange={(e) =>
                                        handleEditChange(
                                            idx,
                                            "caption",
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                            <label className="text-xs text-gray-500">
                                Sサイズ金額
                                <input
                                    type="number"
                                    className="border px-2 py-1 rounded w-full"
                                    value={img.price_s ?? ""}
                                    onChange={(e) =>
                                        handleEditChange(
                                            idx,
                                            "price_s",
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                            <label className="text-xs text-gray-500">
                                Lサイズ金額
                                <input
                                    type="number"
                                    className="border px-2 py-1 rounded w-full"
                                    value={img.price_l ?? ""}
                                    onChange={(e) =>
                                        handleEditChange(
                                            idx,
                                            "price_l",
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                            <label className="text-xs text-gray-500">
                                その他サイズ金額
                                <input
                                    type="number"
                                    className="border px-2 py-1 rounded w-full"
                                    value={img.price_other ?? ""}
                                    onChange={(e) =>
                                        handleEditChange(
                                            idx,
                                            "price_other",
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                            <label className="text-xs text-gray-500">
                                公開
                                <input
                                    type="checkbox"
                                    checked={!!img.is_public}
                                    onChange={(e) =>
                                        handleEditChange(
                                            idx,
                                            "is_public",
                                            e.target.checked
                                        )
                                    }
                                />
                            </label>
                            <label className="text-xs text-gray-500">
                                表示順
                                <input
                                    type="number"
                                    className="border px-2 py-1 rounded w-full"
                                    value={img.display_order ?? ""}
                                    onChange={(e) =>
                                        handleEditChange(
                                            idx,
                                            "display_order",
                                            e.target.value
                                        )
                                    }
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
                                    onChange={(e) =>
                                        handleEditChange(
                                            idx,
                                            "start_at",
                                            e.target.value
                                        )
                                    }
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
                                    onChange={(e) =>
                                        handleEditChange(
                                            idx,
                                            "end_at",
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                            <label className="text-xs text-gray-500">
                                タグ
                                <div className="flex gap-2 flex-wrap">
                                    {tagList.map((tag) => (
                                        <label
                                            key={tag.id}
                                            className="flex items-center gap-1"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    Array.isArray(img.tags)
                                                        ? img.tags.includes(
                                                              tag.id
                                                          )
                                                        : false
                                                }
                                                onChange={(e) =>
                                                    handleTagChange(
                                                        idx,
                                                        tag.id,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span>{tag.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </label>
                        </div>
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => handleEditSave(editImages[idx])}
                        >
                            保存
                        </button>
                    </div>
                </form>
            ))}
        </div>
    );
};

export default ImageEditSection;
