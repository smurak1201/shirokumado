/**
 * ImageEditForm.tsx
 *
 * 画像メニューの編集フォーム。
 * タイトル・価格・タグ・カテゴリーなどを編集し、API経由で保存・削除可能。
 *
 * 主な機能:
 * - 画像情報の編集
 * - 削除（API連携）
 * - 入力値のバリデーション
 *
 * 利用技術:
 * - React関数コンポーネント
 * - useState
 */

// React本体
import React from "react";
// 画像メニュー型・タグ型定義
import type { ImageItem, Tag } from "./ImageEditSection";

interface Props {
    img: ImageItem;
    idx: number;
    categoryList: { id: number; name: string }[];
    tagList: Tag[];
    onChange: (idx: number, newImg: ImageItem) => void;
    onSave: (img: ImageItem) => void;
    apiOrigin: string;
    isLast?: boolean;
    onDeleted?: (img: ImageItem) => void;
}

const ImageEditForm: React.FC<Props> = ({
    apiOrigin,
    img,
    idx,
    categoryList,
    tagList,
    onChange,
    onSave,
    isLast,
    onDeleted,
}) => {
    const [deleteConfirm, setDeleteConfirm] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const handleDelete = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            setTimeout(() => setDeleteConfirm(false), 4000); // 4秒で自動リセット
            return;
        }
        setDeleting(true);
        try {
            const res = await fetch(`${apiOrigin}/api/images/${img.id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("削除に失敗しました");
            alert("画像を削除しました");
            if (onDeleted) onDeleted(img);
        } catch (e: any) {
            alert(e.message || "削除に失敗しました");
        } finally {
            setDeleting(false);
            setDeleteConfirm(false);
        }
    };
    const isCategorySelected = !!img.category_id;
    const isPublic = img.is_public === true || img.is_public === 1;
    const altText = img.title;
    return (
        <form
            className={`border rounded-xl p-4 bg-gray-50 ${
                isLast ? "mb-0" : "mb-6"
            }`}
        >
            <div className="flex gap-4 items-center">
                <img
                    src={`${apiOrigin}/images/${img.file_path}`}
                    alt={altText}
                    className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 flex flex-col gap-2">
                    {/* title */}
                    <label className="text-xs text-gray-500">
                        タイトル
                        <textarea
                            className="w-full px-2 py-1 border rounded text-base"
                            rows={2}
                            value={img.title ?? ""}
                            onChange={(e) =>
                                onChange(idx, { ...img, title: e.target.value })
                            }
                        />
                    </label>
                    {/* price_s */}
                    <label className="text-xs text-gray-500">
                        価格S
                        <input
                            type="number"
                            step="1"
                            inputMode="numeric"
                            className="w-full px-2 py-1 border rounded text-base"
                            value={
                                img.price_s != null
                                    ? Math.floor(img.price_s)
                                    : ""
                            }
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                onChange(idx, {
                                    ...img,
                                    price_s:
                                        e.target.value === ""
                                            ? null
                                            : Math.floor(
                                                  Number(e.target.value)
                                              ),
                                })
                            }
                        />
                    </label>
                    {/* price_l */}
                    <label className="text-xs text-gray-500">
                        価格L
                        <input
                            type="number"
                            step="1"
                            inputMode="numeric"
                            className="w-full px-2 py-1 border rounded text-base"
                            value={
                                img.price_l != null
                                    ? Math.floor(img.price_l)
                                    : ""
                            }
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                onChange(idx, {
                                    ...img,
                                    price_l:
                                        e.target.value === ""
                                            ? null
                                            : Math.floor(
                                                  Number(e.target.value)
                                              ),
                                })
                            }
                        />
                    </label>
                    {/* price_other */}
                    <label className="text-xs text-gray-500">
                        その他価格
                        <input
                            type="number"
                            step="1"
                            inputMode="numeric"
                            className="w-full px-2 py-1 border rounded text-base"
                            value={
                                img.price_other != null
                                    ? Math.floor(img.price_other)
                                    : ""
                            }
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                onChange(idx, {
                                    ...img,
                                    price_other:
                                        e.target.value === ""
                                            ? null
                                            : Math.floor(
                                                  Number(e.target.value)
                                              ),
                                })
                            }
                        />
                    </label>
                    {/* caption */}
                    <label className="text-xs text-gray-500">
                        キャプション
                        <textarea
                            className="w-full px-2 py-1 border rounded text-base"
                            rows={7}
                            value={img.caption ?? ""}
                            onChange={(e) =>
                                onChange(idx, {
                                    ...img,
                                    caption: e.target.value,
                                })
                            }
                        />
                    </label>
                    {/* category_id */}
                    <label className="text-xs text-gray-500">
                        カテゴリー
                        <select
                            className="w-full px-2 py-1 border rounded"
                            value={img.category_id ?? ""}
                            onChange={(e) =>
                                onChange(idx, {
                                    ...img,
                                    category_id: Number(e.target.value),
                                })
                            }
                        >
                            <option value="">選択してください</option>
                            {categoryList.map((cat) => (
                                <option key={cat.id} value={cat.id}>
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
                                    checked={isPublic}
                                    onChange={() =>
                                        onChange(idx, {
                                            ...img,
                                            is_public: true,
                                        })
                                    }
                                />
                                <span>公開</span>
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name={`is_public_${img.id}`}
                                    value="0"
                                    checked={!isPublic}
                                    onChange={() =>
                                        onChange(idx, {
                                            ...img,
                                            is_public: false,
                                        })
                                    }
                                />
                                <span>非公開</span>
                            </label>
                        </div>
                    </label>
                    {/* start_at */}
                    <label className="text-xs text-gray-500">
                        公開開始日時
                        <div className="flex gap-2 items-center">
                            <input
                                type="datetime-local"
                                className="w-full px-2 py-1 border rounded"
                                value={img.start_at ?? ""}
                                onChange={(e) =>
                                    onChange(idx, {
                                        ...img,
                                        start_at: e.target.value,
                                    })
                                }
                            />
                            {img.start_at && (
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-700 px-2"
                                    onClick={(
                                        e: React.MouseEvent<HTMLButtonElement>
                                    ) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onChange(idx, {
                                            ...img,
                                            start_at: "",
                                        });
                                    }}
                                    aria-label="公開開始日時クリア"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </label>
                    {/* end_at */}
                    <label className="text-xs text-gray-500">
                        公開終了日時
                        <div className="flex gap-2 items-center">
                            <input
                                type="datetime-local"
                                className="w-full px-2 py-1 border rounded"
                                value={img.end_at ?? ""}
                                onChange={(e) =>
                                    onChange(idx, {
                                        ...img,
                                        end_at: e.target.value,
                                    })
                                }
                            />
                            {img.end_at && (
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-700 px-2"
                                    onClick={(
                                        e: React.MouseEvent<HTMLButtonElement>
                                    ) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onChange(idx, {
                                            ...img,
                                            end_at: "",
                                        });
                                    }}
                                    aria-label="公開終了日時クリア"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </label>
                    {/* タグ複数選択 */}
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
                                            Array.isArray(img.tags)
                                                ? typeof img.tags[0] ===
                                                  "object"
                                                    ? (
                                                          img.tags as {
                                                              id: number;
                                                          }[]
                                                      ).some(
                                                          (t) => t.id === tag.id
                                                      )
                                                    : (
                                                          img.tags as number[]
                                                      ).includes(tag.id)
                                                : false
                                        }
                                        onChange={(e) => {
                                            if (
                                                Array.isArray(img.tags) &&
                                                typeof img.tags[0] === "object"
                                            ) {
                                                let tags = img.tags as {
                                                    id: number;
                                                }[];
                                                if (e.target.checked) {
                                                    tags = [
                                                        ...tags,
                                                        { id: tag.id },
                                                    ];
                                                } else {
                                                    tags = tags.filter(
                                                        (t) => t.id !== tag.id
                                                    );
                                                }
                                                onChange(idx, { ...img, tags });
                                            } else {
                                                let tags =
                                                    (img.tags as number[]) ??
                                                    [];
                                                if (e.target.checked) {
                                                    tags = [...tags, tag.id];
                                                } else {
                                                    tags = tags.filter(
                                                        (tid) => tid !== tag.id
                                                    );
                                                }
                                                onChange(idx, { ...img, tags });
                                            }
                                        }}
                                    />
                                    <span>{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    </label>
                </div>
                <div className="flex flex-col gap-2 min-w-[90px]">
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={!isCategorySelected}
                        onClick={() => onSave(img)}
                    >
                        保存
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded text-white ${
                            deleteConfirm ? "bg-red-700" : "bg-red-500"
                        }`}
                        disabled={deleting}
                        onClick={handleDelete}
                        title="この操作は取り消しできません"
                    >
                        {deleting
                            ? "削除中..."
                            : deleteConfirm
                            ? "本当に削除しますか? (再クリック)"
                            : "削除"}
                    </button>
                </div>
            </div>
        </form>
    );
};
export default ImageEditForm;
