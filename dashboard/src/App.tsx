import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import MenuSection from "./MenuSection";
import ImageEditSection from "./components/ImageEditSection";
import ImageAddForm from "./components/ImageAddForm";
import Pagination from "./components/Pagination";

type ImageItem = {
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

function App() {
    // 設定画面 検索用state
    const [searchCategory, setSearchCategory] = useState<string>("");
    const [searchPublic, setSearchPublic] = useState<string>("");
    const [searchTags, setSearchTags] = useState<number[]>([]);
    // 設定画面ページネーション用
    const [editPage, setEditPage] = useState(1);
    const editPageSize = 10;
    // タブ状態: 0=配置登録, 1=登録内容変更, 2=新規追加
    const [activeTab, setActiveTab] = useState<number>(() => {
        const saved = window.localStorage.getItem("activeTab");
        return saved !== null ? Number(saved) : 0;
    });
    const apiOrigin = import.meta.env.VITE_API_ORIGIN;

    // 並び替え用state（各カテゴリごと）
    const [limitedMenu, setLimitedMenu] = useState<ImageItem[]>([]);
    const [normalMenu, setNormalMenu] = useState<ImageItem[]>([]);
    const [sideMenu, setSideMenu] = useState<ImageItem[]>([]);
    // 並び順トグルstate（true: id昇順, false: id降順）
    const [limitedAsc, setLimitedAsc] = useState<boolean>(true);
    const [normalAsc, setNormalAsc] = useState<boolean>(true);
    const [sideAsc, setSideAsc] = useState<boolean>(true);

    // 画像一覧を一元管理
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

    // 画像データ取得（初回・追加・編集・削除時に再利用）
    const fetchImages = async () => {
        const res = await fetch(`${apiOrigin}/api/images`);
        if (res.ok) {
            const data = await res.json();
            setEditImages(data);
        }
    };
    // 初回・タブ切り替え時に画像一覧取得
    useEffect(() => {
        fetchImages();
    }, [apiOrigin]);

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

    // editImagesが変化したら各メニューstateも再計算し即時反映
    useEffect(() => {
        // 公開画像のみ抽出（型を文字列で統一判定）
        const publicImages = editImages.filter(
            (img) => String(img.is_public) === "1" || img.is_public === true
        );
        setLimitedMenu(
            publicImages.filter(
                (img) => Array.isArray(img.tags) && img.tags.includes(2)
            )
        );
        setNormalMenu(
            publicImages.filter(
                (img) => Array.isArray(img.tags) && img.tags.includes(1)
            )
        );
        setSideMenu(
            publicImages.filter((img) => img.category_name === "サイドメニュー")
        );
    }, [editImages]);

    // 並び順自動登録: editImagesが変化した直後に各メニューの並び順をDBに自動登録
    useEffect(() => {
        // 並び順登録は各メニューstateが更新された直後に行う
        if (limitedMenu.length > 0) {
            updateDisplayOrder("limitedMenu");
        }
        if (normalMenu.length > 0) {
            updateDisplayOrder("normalMenu");
        }
        if (sideMenu.length > 0) {
            updateDisplayOrder("sideMenu");
        }
        // eslint-disable-next-line
    }, [limitedMenu, normalMenu, sideMenu]);

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
                            onClick={() => {
                                setActiveTab(idx);
                                window.localStorage.setItem(
                                    "activeTab",
                                    String(idx)
                                );
                            }}
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
                    {/* 検索UI */}
                    <form className="flex flex-wrap gap-4 mb-4 items-end">
                        <div>
                            <label className="text-xs text-gray-500">
                                カテゴリー
                            </label>
                            <select
                                className="w-32 px-2 py-1 border rounded"
                                value={searchCategory}
                                onChange={(e) => {
                                    setSearchCategory(e.target.value);
                                    setEditPage(1);
                                }}
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
                            <label className="text-xs text-gray-500">
                                公開状態
                            </label>
                            <select
                                className="w-24 px-2 py-1 border rounded"
                                value={searchPublic}
                                onChange={(e) => {
                                    setSearchPublic(e.target.value);
                                    setEditPage(1);
                                }}
                            >
                                <option value="">すべて</option>
                                <option value="1">公開</option>
                                <option value="0">非公開</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">
                                タグ
                            </label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {tagList.map((tag) => (
                                    <label
                                        key={tag.id}
                                        className="flex items-center gap-1"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={searchTags.includes(
                                                tag.id
                                            )}
                                            onChange={(e) => {
                                                setEditPage(1);
                                                setSearchTags((prev) =>
                                                    e.target.checked
                                                        ? [...prev, tag.id]
                                                        : prev.filter(
                                                              (tid) =>
                                                                  tid !== tag.id
                                                          )
                                                );
                                            }}
                                        />
                                        <span>{tag.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="px-3 py-1 bg-gray-200 rounded text-sm"
                            onClick={() => {
                                setSearchCategory("");
                                setSearchPublic("");
                                setSearchTags([]);
                                setEditPage(1);
                            }}
                        >
                            リセット
                        </button>
                    </form>
                    {/* 絞り込みロジック */}
                    {(() => {
                        let filtered = editImages;
                        if (searchCategory) {
                            filtered = filtered.filter(
                                (img) =>
                                    String(img.category_id) === searchCategory
                            );
                        }
                        if (searchPublic) {
                            filtered = filtered.filter(
                                (img) => String(img.is_public) === searchPublic
                            );
                        }
                        if (searchTags.length > 0) {
                            filtered = filtered.filter(
                                (img) =>
                                    Array.isArray(img.tags) &&
                                    img.tags !== undefined &&
                                    searchTags.every((tid) =>
                                        (img.tags as number[]).includes(tid)
                                    )
                            );
                        }
                        return (
                            <>
                                <Pagination
                                    current={editPage}
                                    total={filtered.length}
                                    pageSize={editPageSize}
                                    onChange={setEditPage}
                                />
                                <ImageEditSection
                                    apiOrigin={apiOrigin}
                                    images={filtered.slice(
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
                                                        "Content-Type":
                                                            "application/json",
                                                    },
                                                    body: JSON.stringify(img),
                                                }
                                            );
                                            if (!res.ok)
                                                throw new Error(
                                                    "保存に失敗しました"
                                                );
                                            await fetchImages();
                                            alert("保存しました");
                                        } catch (e: any) {
                                            alert(
                                                e.message ||
                                                    "保存に失敗しました"
                                            );
                                        }
                                    }}
                                    onDeleted={async () => {
                                        await fetchImages();
                                    }}
                                />
                            </>
                        );
                    })()}
                </div>
            )}
            {activeTab === 2 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">
                        追加
                    </h2>
                    <p className="mb-2 text-sm text-gray-500">
                        新しい画像を登録できます。
                    </p>
                    <ImageAddForm
                        apiOrigin={apiOrigin}
                        categoryList={categoryList}
                        tagList={tagList}
                        onAdded={async () => {
                            await fetchImages();
                        }}
                    />
                </div>
            )}
        </main>
    );
}

export default App;
