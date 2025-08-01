/**
 * ImageEditSection.tsx
 *
 * 画像メニュー編集セクション。
 * 複数画像の編集フォームをリスト表示し、編集・保存・削除を一括管理。
 *
 * 主な機能:
 * - 画像リストの編集
 * - 編集フォームの表示・管理
 * - 入力値の型変換・バリデーション
 *
 * 利用技術:
 * - React関数コンポーネント
 * - useState, useEffect
 */

// React本体
import React, { useState, useEffect } from "react";
// 画像編集フォーム
import ImageEditForm from "./ImageEditForm";

export type ImageItem = {
    id: number;
    name?: string;
    category_id?: number | null;
    tags?: number[] | { id: number }[];
    price_s?: number | null;
    price_l?: number | null;
    price_other?: number | null;
    display_order?: number | null;
    is_public?: boolean | number;
    [key: string]: any;
};

export type Category = {
    id: number;
    name: string;
};

export type Tag = {
    id: number;
    name: string;
};

export type Props = {
    apiOrigin: string;
    images: ImageItem[];
    categoryList: Category[];
    tagList: Tag[];
    onSave: (img: ImageItem) => Promise<void>;
    onDeleted?: () => void;
};

const ImageEditSection: React.FC<Props> = (props) => {
    const { apiOrigin, images, categoryList, tagList, onSave } = props;
    const [editImages, setEditImages] = useState<ImageItem[]>([]);
    const [editError, setEditError] = useState<string>("");
    const [editLoading, setEditLoading] = useState<boolean>(false);
    const [activeEditId, setActiveEditId] = useState<number | null>(null);

    useEffect(() => {
        const fixedImages = Array.isArray(images)
            ? images.map((img) => {
                  if (!("tags" in img) || img.tags == null) {
                      return { ...img, tags: [] };
                  }
                  if (
                      Array.isArray(img.tags) &&
                      img.tags.length > 0 &&
                      typeof img.tags[0] === "object" &&
                      "id" in img.tags[0]
                  ) {
                      return {
                          ...img,
                          tags: (img.tags as any[]).map((t) => t.id),
                      };
                  }
                  return img;
              })
            : [];
        setEditImages(fixedImages);
    }, [images]);

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
        if (typeof cleanImg.is_public === "boolean")
            (cleanImg as any).is_public = cleanImg.is_public ? 1 : 0;
        try {
            await onSave(cleanImg);
        } catch (e: any) {
            setEditError(e.message || "保存に失敗しました");
        } finally {
            setEditLoading(false);
        }
    };

    const filteredImages = editImages.filter((img) => {
        if (!!img.category_id) return true;
        if (activeEditId === img.id) return true;
        return false;
    });

    return (
        <div className="flex flex-col gap-6">
            {editError && <div className="text-red-500 mb-2">{editError}</div>}
            {editLoading && <div className="text-blue-500 mb-2">保存中...</div>}
            {filteredImages.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                    登録がありません
                </div>
            ) : (
                <div>
                    <div className="pb-6">
                        {filteredImages.map((img, idx) => (
                            <ImageEditForm
                                key={img.id + "_" + idx}
                                apiOrigin={apiOrigin}
                                img={img}
                                idx={editImages.findIndex(
                                    (e) => e.id === img.id
                                )}
                                categoryList={categoryList}
                                tagList={tagList}
                                onChange={(i: number, newImg: ImageItem) => {
                                    setActiveEditId(newImg.id);
                                    setEditImages((prev) => {
                                        const next = [...prev];
                                        next[i] = newImg;
                                        return next;
                                    });
                                }}
                                onSave={async (img: ImageItem) => {
                                    await handleEditSave(img);
                                    setActiveEditId(null);
                                }}
                                onDeleted={(deletedImg) => {
                                    if (props.onDeleted) props.onDeleted();
                                    setEditImages((prev) =>
                                        prev.filter(
                                            (i) => i.id !== deletedImg.id
                                        )
                                    );
                                    setActiveEditId(null);
                                }}
                                isLast={idx === filteredImages.length - 1}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageEditSection;
