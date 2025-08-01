/**
 * ImageAddForm.tsx
 *
 * 画像メニューの新規登録フォームコンポーネント。
 * 管理者が画像ファイル・タイトル・説明・価格・公開状態・公開期間・タグ・カテゴリー等を入力し、
 * API経由で新しい画像メニューを登録できる。
 *
 * 主な機能:
 * - 入力値のバリデーション
 * - 画像ファイルのアップロード
 * - APIへのPOST送信
 * - 登録完了後のフォームリセット・コールバック
 *
 * 利用技術:
 * - React関数コンポーネント
 * - useStateによるフォーム状態管理
 * - fetch APIによる非同期通信
 */

// React本体からuseStateフックをimport（フォーム状態管理用）
import React, { useState } from "react";
// タグ型定義をImageEditSectionからimport（タグ選択用）
import type { Tag } from "./ImageEditSection";

/**
 * Props型定義
 * - apiOrigin: APIのベースURL
 * - categoryList: カテゴリー一覧（プルダウン用）
 * - tagList: タグ一覧（チェックボックス用）
 * - onAdded: 登録完了時のコールバック（任意）
 */
interface Props {
    apiOrigin: string;
    categoryList: { id: number; name: string }[];
    tagList: Tag[];
    onAdded?: () => void;
}

/**
 * ImageAddForm本体
 * - 各フォーム項目はuseStateで管理
 * - 送信時はバリデーション→API送信→リセット
 */
const ImageAddForm: React.FC<Props> = ({
    apiOrigin,
    categoryList,
    tagList,
    onAdded,
}) => {
    // 画像ファイル
    const [file, setFile] = useState<File | null>(null);
    // メニュー名
    const [title, setTitle] = useState("");
    // キャプション
    const [caption, setCaption] = useState("");
    // カテゴリーID
    const [categoryId, setCategoryId] = useState<number | "">("");
    // 価格（S/L/その他）
    const [priceS, setPriceS] = useState<string>("");
    const [priceL, setPriceL] = useState<string>("");
    const [priceOther, setPriceOther] = useState<string>("");
    // 公開状態
    const [isPublic, setIsPublic] = useState<boolean>(true);
    // 公開期間
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    // タグID配列
    const [tags, setTags] = useState<number[]>([]);
    // エラーメッセージ
    const [error, setError] = useState("");
    // ローディング状態
    const [loading, setLoading] = useState(false);

    /**
     * 画像登録フォーム送信ハンドラー
     * - バリデーション（必須項目チェック）
     * - FormData生成・API送信
     * - 成功時はフォームリセット＆コールバック
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        // 必須項目チェック
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
        // FormData生成
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
        // タグ配列
        tags.forEach((tagId) => formData.append("tags[]", String(tagId)));
        try {
            // API送信
            const res = await fetch(`${apiOrigin}/api/images`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("画像の登録に失敗しました");
            // 成功時はフォームリセット
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
                {/* エラー表示 */}
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {/* ローディング表示 */}
                {loading && <div className="text-blue-500 mb-2">登録中...</div>}
                {/* 画像ファイル選択 */}
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
                {/* タイトル入力 */}
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
                {/* キャプション入力 */}
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
                {/* カテゴリー選択 */}
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
                {/* 価格入力（S/L/その他） */}
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
                {/* 公開状態ラジオボタン */}
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
                {/* 公開期間入力 */}
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
                {/* タグ選択（複数） */}
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
                {/* 送信ボタン */}
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
