import React, { useState, useEffect } from "react";
import ImageEditForm from "./ImageEditForm";

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

const ImageEditSection: React.FC<Props> = (props) => {
    const { apiOrigin, images, categoryList, tagList, onSave } = props;
    // Props未使用警告回避用（参照だけ）
    void apiOrigin;

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
        // is_publicをDB用に1/0へ変換（boolean→number）
        if (typeof cleanImg.is_public === "boolean") {
            (cleanImg as any).is_public = cleanImg.is_public ? 1 : 0;
        }
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
                <div>
                    <div className="pb-6">
                        {filteredImages.map((img, idx) => (
                            <ImageEditForm
                                key={img.id}
                                apiOrigin={apiOrigin}
                                img={img}
                                idx={idx}
                                categoryList={categoryList}
                                tagList={tagList}
                                onChange={(i: number, newImg: ImageItem) => {
                                    setEditImages((prev) => {
                                        const next = [...prev];
                                        next[i] = newImg;
                                        return next;
                                    });
                                }}
                                onSave={handleEditSave}
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
