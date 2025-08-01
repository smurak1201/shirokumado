import React, { useState } from "react";

import type { Tag } from "./ImageEditSection";

interface Props {
    apiOrigin: string;
    categoryList: { id: number; name: string }[];
    tagList: Tag[];
    onAdded?: () => void;
}

const ImageAddForm: React.FC<Props> = ({
    apiOrigin,
    categoryList,
    tagList,
    onAdded,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [priceS, setPriceS] = useState<string>("");
    const [priceL, setPriceL] = useState<string>("");
    const [priceOther, setPriceOther] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [tags, setTags] = useState<number[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!file) {
            setError("画像ファイルを選択してください");
            return;
        }
        if (!title) {
            setError("タイトルを入力してください");
            return;
        }
        if (!categoryId) {
            setError("カテゴリーを選択してください");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("caption", caption);
        formData.append("category_id", String(categoryId));
        formData.append("price_s", priceS);
        formData.append("price_l", priceL);
        formData.append("price_other", priceOther);
        formData.append("is_public", isPublic ? "1" : "0");
        formData.append("start_at", startAt);
        formData.append("end_at", endAt);
        tags.forEach((tagId) => formData.append("tags[]", String(tagId)));
        try {
            const res = await fetch(`${apiOrigin}/api/images`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("画像の登録に失敗しました");
            setTitle("");
            setCaption("");
            setCategoryId("");
            setPriceS("");
            setPriceL("");
            setPriceOther("");
            setIsPublic(true);
            setStartAt("");
            setEndAt("");
            setTags([]);
            setFile(null);
            if (onAdded) onAdded();
            alert("画像を登録しました");
        } catch (e: any) {
            setError(e.message || "画像の登録に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="border rounded-xl p-4 bg-gray-50 mb-6"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-4">
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {loading && <div className="text-blue-500 mb-2">登録中...</div>}
                <label className="text-xs text-gray-500">
                    画像ファイル
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/bmp"
                        className="w-full px-2 py-1 border rounded"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setFile(e.target.files[0]);
                            }
                        }}
                    />
                </label>
                <label className="text-xs text-gray-500">
                    タイトル
                    <input
                        type="text"
                        className="w-full px-2 py-1 border rounded"
                        style={{ fontSize: "16px" }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label className="text-xs text-gray-500">
                    キャプション
                    <textarea
                        className="w-full px-2 py-1 border rounded"
                        style={{ fontSize: "16px" }}
                        rows={4}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </label>
                <label className="text-xs text-gray-500">
                    カテゴリー
                    <select
                        className="w-full px-2 py-1 border rounded"
                        style={{ fontSize: "16px" }}
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                    >
                        <option value="">選択してください</option>
                        {categoryList.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="text-xs text-gray-500">
                    価格S
                    <input
                        type="number"
                        step="1"
                        inputMode="numeric"
                        className="w-full px-2 py-1 border rounded"
                        style={{ fontSize: "16px" }}
                        value={priceS}
                        onChange={(e) => setPriceS(e.target.value)}
                    />
                </label>
                <label className="text-xs text-gray-500">
                    価格L
                    <input
                        type="number"
                        step="1"
                        inputMode="numeric"
                        className="w-full px-2 py-1 border rounded"
                        style={{ fontSize: "16px" }}
                        value={priceL}
                        onChange={(e) => setPriceL(e.target.value)}
                    />
                </label>
                <label className="text-xs text-gray-500">
                    その他価格
                    <input
                        type="number"
                        step="1"
                        inputMode="numeric"
                        className="w-full px-2 py-1 border rounded"
                        style={{ fontSize: "16px" }}
                        value={priceOther}
                        onChange={(e) => setPriceOther(e.target.value)}
                    />
                </label>
                <label className="text-xs text-gray-500">
                    公開状態
                    <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="is_public"
                                value="1"
                                checked={isPublic}
                                onChange={() => setIsPublic(true)}
                            />
                            <span>公開</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="is_public"
                                value="0"
                                checked={!isPublic}
                                onChange={() => setIsPublic(false)}
                            />
                            <span>非公開</span>
                        </label>
                    </div>
                </label>
                <label className="text-xs text-gray-500">
                    公開開始日時
                    <input
                        type="datetime-local"
                        className="w-full px-2 py-1 border rounded"
                        style={{ fontSize: "16px" }}
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                    />
                </label>
                <label className="text-xs text-gray-500">
                    公開終了日時
                    <input
                        type="datetime-local"
                        className="w-full px-2 py-1 border rounded"
                        style={{ fontSize: "16px" }}
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                    />
                </label>
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
                                    checked={tags.includes(tag.id)}
                                    onChange={(e) => {
                                        let next = tags;
                                        if (e.target.checked) {
                                            next = [...next, tag.id];
                                        } else {
                                            next = next.filter(
                                                (tid) => tid !== tag.id
                                            );
                                        }
                                        setTags(next);
                                    }}
                                />
                                <span>{tag.name}</span>
                            </label>
                        ))}
                    </div>
                </label>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={loading}
                >
                    画像を登録
                </button>
            </div>
        </form>
    );
};

export default ImageAddForm;
