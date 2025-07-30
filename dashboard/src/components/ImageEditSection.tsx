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
    tagList: { id: number; name: string }[];
    onSave: (img: ImageItem) => Promise<void>;
}

// ...existing code...
const ImageEditSection: React.FC<Props> = (props) => {
    const { apiOrigin, images, categoryList, tagList, onSave } = props;
    // Props未使用警告回避用（参照だけ）
    void categoryList;
    void tagList;
    void onSave;

    // 編集用state
    const [editImages, setEditImages] = useState<ImageItem[]>([]);
    const [editError, setEditError] = useState<string>("");
    const [editLoading, setEditLoading] = useState<boolean>(false);

    useEffect(() => {
        // imagesのtagsが未定義/nullの場合のみ空配列に補正、配列ならそのまま
        const fixedImages = Array.isArray(images)
            ? images.map((img) => {
                  if (img.tags === undefined || img.tags === null) {
                      return { ...img, tags: [] };
                  }
                  if (
                      Array.isArray(img.tags) &&
                      img.tags.length > 0 &&
                      typeof img.tags[0] === "object"
                  ) {
                      return { ...img, tags: img.tags.map((t: any) => t.id) };
                  }
                  return img;
              })
            : [];
        setEditImages(fixedImages);
    }, [images]);

    // 保存処理
    const handleEditSave = async (img: ImageItem) => {
        setEditLoading(true);
        setEditError("");
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

    // category_idが厳密に存在する画像のみ表示（null/undefined/0/空文字除外）
    // 公開・非公開問わず、category_idが存在する画像はすべて表示
    const filteredImages = editImages.filter((img) => !!img.category_id);

    return (
        <div className="flex flex-col gap-6">
            {editError && <div className="text-red-500 mb-2">{editError}</div>}
            {editLoading && <div className="text-blue-500 mb-2">保存中...</div>}
            {filteredImages.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                    登録がありません
                </div>
            ) : (
                filteredImages.map((img, idx) => {
                    const isCategorySelected = !!img.category_id;
                    let isPublic: boolean = false;
                    if (typeof img.is_public === "number") {
                        isPublic = img.is_public === 1;
                    } else if (typeof img.is_public === "string") {
                        isPublic = img.is_public === "1";
                    }
                    // alt_textはtitleと同じ値を自動でセット
                    const altText = img.title;
                    return (
                        <form
                            key={img.id}
                            className="border rounded-xl p-4 bg-gray-50"
                        >
                            <div className="flex gap-4 items-center">
                                {/* file_path（画像プレビュー） */}
                                <img
                                    src={`${apiOrigin}/images/${img.file_path}`}
                                    alt={altText}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1 flex flex-col gap-2">
                                    {/* title */}
                                    <label className="text-xs text-gray-500">
                                        タイトル
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border rounded"
                                            value={img.title ?? ""}
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
                                    {/* price_s */}
                                    <label className="text-xs text-gray-500">
                                        価格S
                                        <input
                                            type="number"
                                            step="1"
                                            inputMode="numeric"
                                            className="w-full px-2 py-1 border rounded"
                                            value={
                                                img.price_s != null
                                                    ? Math.floor(img.price_s)
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                setEditImages((prev) => {
                                                    const next = [...prev];
                                                    next[idx] = {
                                                        ...next[idx],
                                                        price_s:
                                                            e.target.value ===
                                                            ""
                                                                ? null
                                                                : Math.floor(
                                                                      Number(
                                                                          e
                                                                              .target
                                                                              .value
                                                                      )
                                                                  ),
                                                    };
                                                    return next;
                                                });
                                            }}
                                        />
                                    </label>
                                    {/* price_l */}
                                    <label className="text-xs text-gray-500">
                                        価格L
                                        <input
                                            type="number"
                                            step="1"
                                            inputMode="numeric"
                                            className="w-full px-2 py-1 border rounded"
                                            value={
                                                img.price_l != null
                                                    ? Math.floor(img.price_l)
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                setEditImages((prev) => {
                                                    const next = [...prev];
                                                    next[idx] = {
                                                        ...next[idx],
                                                        price_l:
                                                            e.target.value ===
                                                            ""
                                                                ? null
                                                                : Math.floor(
                                                                      Number(
                                                                          e
                                                                              .target
                                                                              .value
                                                                      )
                                                                  ),
                                                    };
                                                    return next;
                                                });
                                            }}
                                        />
                                    </label>
                                    {/* price_other */}
                                    <label className="text-xs text-gray-500">
                                        その他価格
                                        <input
                                            type="number"
                                            step="1"
                                            inputMode="numeric"
                                            className="w-full px-2 py-1 border rounded"
                                            value={
                                                img.price_other != null
                                                    ? Math.floor(
                                                          img.price_other
                                                      )
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                setEditImages((prev) => {
                                                    const next = [...prev];
                                                    next[idx] = {
                                                        ...next[idx],
                                                        price_other:
                                                            e.target.value ===
                                                            ""
                                                                ? null
                                                                : Math.floor(
                                                                      Number(
                                                                          e
                                                                              .target
                                                                              .value
                                                                      )
                                                                  ),
                                                    };
                                                    return next;
                                                });
                                            }}
                                        />
                                    </label>
                                    {/* caption */}
                                    <label className="text-xs text-gray-500">
                                        キャプション
                                        <textarea
                                            className="w-full px-2 py-1 border rounded"
                                            rows={7}
                                            value={img.caption ?? ""}
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
                                    {/* category_id */}
                                    <label className="text-xs text-gray-500">
                                        カテゴリー
                                        <select
                                            className="w-full px-2 py-1 border rounded"
                                            value={img.category_id ?? ""}
                                            onChange={(e) => {
                                                setEditImages((prev) => {
                                                    const next = [...prev];
                                                    next[idx] = {
                                                        ...next[idx],
                                                        category_id: Number(
                                                            e.target.value
                                                        ),
                                                    };
                                                    return next;
                                                });
                                            }}
                                        >
                                            <option value="">
                                                選択してください
                                            </option>
                                            {categoryList.map((cat) => (
                                                <option
                                                    key={cat.id}
                                                    value={cat.id}
                                                >
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    {/* is_public */}
                                    <label className="text-xs text-gray-500">
                                        公開状態
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name={`is_public_${img.id}`}
                                                    value="1"
                                                    checked={isPublic === true}
                                                    onChange={() => {
                                                        setEditImages(
                                                            (prev) => {
                                                                const next = [
                                                                    ...prev,
                                                                ];
                                                                next[idx] = {
                                                                    ...next[
                                                                        idx
                                                                    ],
                                                                    is_public:
                                                                        true,
                                                                };
                                                                return next;
                                                            }
                                                        );
                                                    }}
                                                />
                                                <span>公開</span>
                                            </label>
                                            <label className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name={`is_public_${img.id}`}
                                                    value="0"
                                                    checked={isPublic === false}
                                                    onChange={() => {
                                                        setEditImages(
                                                            (prev) => {
                                                                const next = [
                                                                    ...prev,
                                                                ];
                                                                next[idx] = {
                                                                    ...next[
                                                                        idx
                                                                    ],
                                                                    is_public:
                                                                        false,
                                                                };
                                                                return next;
                                                            }
                                                        );
                                                    }}
                                                />
                                                <span>非公開</span>
                                            </label>
                                        </div>
                                    </label>
                                    {/* start_at */}
                                    <label className="text-xs text-gray-500">
                                        公開開始日時
                                        <input
                                            type="datetime-local"
                                            className="w-full px-2 py-1 border rounded"
                                            value={img.start_at ?? ""}
                                            onChange={(e) => {
                                                setEditImages((prev) => {
                                                    const next = [...prev];
                                                    next[idx] = {
                                                        ...next[idx],
                                                        start_at:
                                                            e.target.value,
                                                    };
                                                    return next;
                                                });
                                            }}
                                        />
                                    </label>
                                    {/* end_at */}
                                    <label className="text-xs text-gray-500">
                                        公開終了日時
                                        <input
                                            type="datetime-local"
                                            className="w-full px-2 py-1 border rounded"
                                            value={img.end_at ?? ""}
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
                                    {/* タグ複数選択（DBカラム外） */}
                                    <label className="text-xs text-gray-500">
                                        タグ
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {tagList.map((tag) => (
                                                <label
                                                    key={tag.id}
                                                    className="flex items-center gap-1"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            img.tags?.includes(
                                                                tag.id
                                                            ) ?? false
                                                        }
                                                        onChange={(e) => {
                                                            setEditImages(
                                                                (prev) => {
                                                                    const next =
                                                                        [
                                                                            ...prev,
                                                                        ];
                                                                    let tags =
                                                                        next[
                                                                            idx
                                                                        ]
                                                                            .tags ??
                                                                        [];
                                                                    if (
                                                                        e.target
                                                                            .checked
                                                                    ) {
                                                                        tags = [
                                                                            ...tags,
                                                                            tag.id,
                                                                        ];
                                                                    } else {
                                                                        tags =
                                                                            tags.filter(
                                                                                (
                                                                                    tid
                                                                                ) =>
                                                                                    tid !==
                                                                                    tag.id
                                                                            );
                                                                    }
                                                                    next[idx] =
                                                                        {
                                                                            ...next[
                                                                                idx
                                                                            ],
                                                                            tags,
                                                                        };
                                                                    return next;
                                                                }
                                                            );
                                                        }}
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
                                    disabled={!isCategorySelected}
                                    onClick={() => handleEditSave(img)}
                                >
                                    保存
                                </button>
                            </div>
                        </form>
                    );
                })
            )}
        </div>
    );
};
export default ImageEditSection;
