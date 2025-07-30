import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import MenuSection from "./MenuSection";
import ImageEditSection from "./components/ImageEditSection";

type ImageItem = {
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

function App() {
    // 設定画面ページネーション用
    const [editPage, setEditPage] = useState(1);
    const editPageSize = 10;
    const [editTotal, setEditTotal] = useState(0);
    // タブ状態: 0=配置登録, 1=登録内容変更, 2=新規追加
    const [activeTab, setActiveTab] = useState<number>(0);
    const apiOrigin = import.meta.env.VITE_API_ORIGIN;

    // 並び替え用state（各カテゴリごと）
    const [limitedMenu, setLimitedMenu] = useState<ImageItem[]>([]);
    const [normalMenu, setNormalMenu] = useState<ImageItem[]>([]);
    const [sideMenu, setSideMenu] = useState<ImageItem[]>([]);
    // 並び順トグルstate（true: id昇順, false: id降順）
    const [limitedAsc, setLimitedAsc] = useState<boolean>(true);
    const [normalAsc, setNormalAsc] = useState<boolean>(true);
    const [sideAsc, setSideAsc] = useState<boolean>(true);

    // 設定画面用: 編集フォームのローカルstate
    const [editImages, setEditImages] = useState<ImageItem[]>([]);
    // カテゴリー一覧
    const [categoryList, setCategoryList] = useState<
        { id: number; name: string }[]
    >([]);
    // タグ一覧
    const [tagList, setTagList] = useState<{ id: number; name: string }[]>([]);

    // カテゴリー一覧取得
    useEffect(() => {
        fetch(`${apiOrigin}/api/categories`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setCategoryList(data))
            .catch(() => setCategoryList([]));
        fetch(`${apiOrigin}/api/tags`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setTagList(data))
            .catch(() => setTagList([]));
    }, [apiOrigin]);
    // DnD並び替え用
    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination } = result;
        let items: ImageItem[] = [];
        let setItems: React.Dispatch<React.SetStateAction<ImageItem[]>>;
        if (source.droppableId === "limitedMenu") {
            items = Array.from(limitedMenu);
            setItems = setLimitedMenu;
        } else if (source.droppableId === "normalMenu") {
            items = Array.from(normalMenu);
            setItems = setNormalMenu;
        } else if (source.droppableId === "sideMenu") {
            items = Array.from(sideMenu);
            setItems = setSideMenu;
        } else {
            return;
        }
        const [removed] = items.splice(source.index, 1);
        items.splice(destination.index, 0, removed);
        setItems(items);
    };

    // 設定タブ表示時に画像データをセット
    useEffect(() => {
        if (activeTab === 1) {
            fetch(`${apiOrigin}/api/images`)
                .then((res) => {
                    if (!res.ok) throw new Error("API error");
                    return res.json();
                })
                .then((data: ImageItem[]) => {
                    setEditTotal(data.length);
                    setEditImages(data);
                })
                .catch(() => {
                    setEditImages([]);
                    setEditTotal(0);
                });
        }
    }, [activeTab, limitedMenu, normalMenu, sideMenu]);

    // 並び替えボタン用: id昇順/降順でstateを更新
    const handleLimitedSort = () => {
        setLimitedMenu(
            limitedAsc
                ? [...limitedMenu].sort((a, b) => b.id - a.id)
                : [...limitedMenu].sort((a, b) => a.id - b.id)
        );
        setLimitedAsc((v) => !v);
    };
    const handleNormalSort = () => {
        setNormalMenu(
            normalAsc
                ? [...normalMenu].sort((a, b) => b.id - a.id)
                : [...normalMenu].sort((a, b) => a.id - b.id)
        );
        setNormalAsc((v) => !v);
    };
    const handleSideSort = () => {
        setSideMenu(
            sideAsc
                ? [...sideMenu].sort((a, b) => b.id - a.id)
                : [...sideMenu].sort((a, b) => a.id - b.id)
        );
        setSideAsc((v) => !v);
    };

    // 並び順をDBに登録する関数
    const updateDisplayOrder = async (
        menuType: "limitedMenu" | "normalMenu" | "sideMenu"
    ) => {
        let items: ImageItem[] = [];
        if (menuType === "limitedMenu") items = limitedMenu;
        else if (menuType === "normalMenu") items = normalMenu;
        else if (menuType === "sideMenu") items = sideMenu;
        const payload = items.map((item, idx) => ({
            id: item.id,
            display_order: idx + 1,
        }));
        try {
            const res = await fetch(`${apiOrigin}/api/images/display-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orders: payload }),
            });
            if (!res.ok) throw new Error("DB更新に失敗しました");
            alert("並び順を保存しました");
        } catch (e) {
            alert("DB更新に失敗しました");
        }
    };

    // 画像データ取得
    useEffect(() => {
        fetch(`${apiOrigin}/api/images`)
            .then((res) => {
                if (!res.ok) throw new Error("API error");
                return res.json();
            })
            .then((data: ImageItem[]) => {
                // 公開画像のみ抽出（型を文字列で統一判定）
                const publicImages = data.filter(
                    (img) =>
                        String(img.is_public) === "1" || img.is_public === true
                );
                // 限定メニュー: tagsに2が含まれる
                setLimitedMenu(
                    publicImages.filter(
                        (img) => Array.isArray(img.tags) && img.tags.includes(2)
                    )
                );
                // 通常メニュー: tagsに1が含まれる
                setNormalMenu(
                    publicImages.filter(
                        (img) => Array.isArray(img.tags) && img.tags.includes(1)
                    )
                );
                // サイドメニュー: category_nameが"サイドメニュー"
                setSideMenu(
                    publicImages.filter(
                        (img) => img.category_name === "サイドメニュー"
                    )
                );
            })
            .catch(() => {
                // データ取得失敗時の処理（必要ならUI追加）
            });
    }, [apiOrigin]);

    return (
        <main className="w-full max-w-xl mx-auto px-2 sm:px-4 py-8 min-h-[900px]">
            {/* タブUI */}
            <div className="flex justify-center">
                <div className="flex">
                    {["配置登録", "設定", "追加"].map((label, idx) => (
                        <button
                            key={label}
                            type="button"
                            className={`w-32 px-6 py-2 text-sm font-semibold mx-1 focus:outline-none transition-all duration-150 border-b-2
                                ${
                                    activeTab === idx
                                        ? "text-blue-600 border-blue-600"
                                        : "text-gray-500 border-transparent"
                                }
                            `}
                            style={{ background: "none" }}
                            onClick={() => setActiveTab(idx)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* タブごとの画面 */}
            {activeTab === 0 && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-row gap-4">
                        <MenuSection
                            title="限定メニュー"
                            items={limitedMenu}
                            apiOrigin={apiOrigin}
                            droppableId="limitedMenu"
                            droppableType="limited"
                            sortAsc={limitedAsc}
                            onToggleSort={handleLimitedSort}
                            onRegisterOrder={async () =>
                                await updateDisplayOrder("limitedMenu")
                            }
                        />
                        <MenuSection
                            title="通常メニュー"
                            items={normalMenu}
                            apiOrigin={apiOrigin}
                            droppableId="normalMenu"
                            droppableType="normal"
                            sortAsc={normalAsc}
                            onToggleSort={handleNormalSort}
                            onRegisterOrder={async () =>
                                await updateDisplayOrder("normalMenu")
                            }
                        />
                        <MenuSection
                            title="サイドメニュー"
                            items={sideMenu}
                            apiOrigin={apiOrigin}
                            droppableId="sideMenu"
                            droppableType="side"
                            sortAsc={sideAsc}
                            onToggleSort={handleSideSort}
                            onRegisterOrder={async () =>
                                await updateDisplayOrder("sideMenu")
                            }
                        />
                    </div>
                </DragDropContext>
            )}
            {activeTab === 1 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">
                        設定（画像編集）
                    </h2>
                    <p className="mb-2 text-sm text-gray-500">
                        画像のタイトルやタグなどを編集できます。
                    </p>
                    {/* ページネーションUI */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">
                            全{editTotal}件中{" "}
                            {editPageSize * (editPage - 1) + 1}～
                            {Math.min(editPage * editPageSize, editTotal)}
                            件を表示
                        </span>
                        <div className="flex gap-2">
                            <button
                                className="px-2 py-1 border rounded text-sm"
                                disabled={editPage === 1}
                                onClick={() =>
                                    setEditPage((p) => Math.max(1, p - 1))
                                }
                            >
                                前へ
                            </button>
                            <span className="px-2 text-sm">
                                {editPage} /{" "}
                                {Math.max(
                                    1,
                                    Math.ceil(editTotal / editPageSize)
                                )}
                            </span>
                            <button
                                className="px-2 py-1 border rounded text-sm"
                                disabled={editPage * editPageSize >= editTotal}
                                onClick={() =>
                                    setEditPage((p) =>
                                        Math.min(
                                            Math.ceil(editTotal / editPageSize),
                                            p + 1
                                        )
                                    )
                                }
                            >
                                次へ
                            </button>
                        </div>
                    </div>
                    <ImageEditSection
                        apiOrigin={apiOrigin}
                        images={editImages.slice(
                            editPageSize * (editPage - 1),
                            editPageSize * editPage
                        )}
                        categoryList={categoryList}
                        tagList={tagList}
                        onSave={async (img: ImageItem) => {
                            try {
                                const res = await fetch(
                                    `${apiOrigin}/api/images/${img.id}`,
                                    {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(img),
                                    }
                                );
                                if (!res.ok)
                                    throw new Error("保存に失敗しました");
                                alert("保存しました");
                            } catch (e: any) {
                                alert(e.message || "保存に失敗しました");
                            }
                        }}
                    />
                </div>
            )}
            {activeTab === 2 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">
                        追加
                    </h2>
                    <p className="mb-2 text-sm text-gray-500">
                        新しい画像を登録できます（仮UI）。
                    </p>
                    {/* ここに新規追加フォームを追加 */}
                    <div className="text-gray-400 text-sm">
                        ※この画面のUIは今後拡張可能です
                    </div>
                </div>
            )}
        </main>
    );
}

export default App;
