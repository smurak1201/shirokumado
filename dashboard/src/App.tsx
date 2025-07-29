import React, { useEffect, useState } from "react";
// BladeのsortByロジックを再現
function sortMenu(items: ImageItem[]) {
    return [...items].sort((a, b) => {
        // display_orderがnullは後ろ
        if (a.display_order == null && b.display_order != null) return 1;
        if (a.display_order != null && b.display_order == null) return -1;
        // display_orderで昇順
        if (a.display_order !== b.display_order) {
            return (
                (a.display_order ?? Infinity) - (b.display_order ?? Infinity)
            );
        }
        // idで昇順
        return a.id - b.id;
    });
}

type ImageItem = {
    id: number;
    title: string;
    file_path: string;
    display_order?: number | null;
    alt_text?: string;
    tag_name?: string;
    category_name?: string;
};

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

function App() {
    // タブ状態: 0=配置登録, 1=登録内容変更, 2=新規追加
    const [activeTab, setActiveTab] = useState(0);
    const apiOrigin = import.meta.env.VITE_API_ORIGIN;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 並び替え用state（各カテゴリごと）
    const [limitedMenu, setLimitedMenu] = useState<ImageItem[]>([]);
    const [normalMenu, setNormalMenu] = useState<ImageItem[]>([]);
    const [sideMenu, setSideMenu] = useState<ImageItem[]>([]);
    // 並び順トグルstate（true: id昇順, false: id降順）
    const [limitedAsc, setLimitedAsc] = useState(true);
    const [normalAsc, setNormalAsc] = useState(true);
    const [sideAsc, setSideAsc] = useState(true);

    // 並び順をDBに登録する関数
    const updateDisplayOrder = async (
        menuType: "limitedMenu" | "normalMenu" | "sideMenu"
    ) => {
        let items: ImageItem[] = [];
        if (menuType === "limitedMenu") {
            items = limitedMenu;
        } else if (menuType === "normalMenu") {
            items = normalMenu;
        } else if (menuType === "sideMenu") {
            items = sideMenu;
        }
        // display_orderを付与
        const payload = items.map((item, idx) => ({
            id: item.id,
            display_order: idx + 1,
        }));
        try {
            const res = await fetch(`${apiOrigin}/api/images/display-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orders: payload }),
            });
            if (!res.ok) throw new Error("DB更新に失敗しました");
            alert("並び順を保存しました");
        } catch (e) {
            alert("DB更新に失敗しました");
        }
    };
    useEffect(() => {
        fetch(`${apiOrigin}/api/images`)
            .then((res) => {
                if (!res.ok) throw new Error("API error");
                return res.json();
            })
            .then((data) => {
                setLimitedMenu(
                    sortMenu(
                        data.filter(
                            (img: ImageItem) => img.tag_name === "限定メニュー"
                        )
                    )
                );
                setNormalMenu(
                    sortMenu(
                        data.filter(
                            (img: ImageItem) => img.tag_name === "通常メニュー"
                        )
                    )
                );
                setSideMenu(
                    sortMenu(
                        data.filter(
                            (img: ImageItem) =>
                                img.category_name === "サイドメニュー"
                        )
                    )
                );
                setLoading(false);
            })
            .catch(() => {
                setError("データの取得に失敗しました");
                setLoading(false);
            });
    }, [apiOrigin]);

    // ドラッグ終了時の処理（リストDnD用、シンプル版）
    const onDragEnd = (result: DropResult) => {
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

    // 早期リターンはHooksの後で
    if (loading) {
        return <div className="text-center py-8">読み込み中...</div>;
    }
    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    // 並び替えボタン用: id昇順/降順でstateを更新
    const handleLimitedSort = () => {
        if (limitedAsc) {
            setLimitedMenu([...limitedMenu].sort((a, b) => b.id - a.id));
        } else {
            setLimitedMenu([...limitedMenu].sort((a, b) => a.id - b.id));
        }
        setLimitedAsc((v) => !v);
    };
    const handleNormalSort = () => {
        if (normalAsc) {
            setNormalMenu([...normalMenu].sort((a, b) => b.id - a.id));
        } else {
            setNormalMenu([...normalMenu].sort((a, b) => a.id - b.id));
        }
        setNormalAsc((v) => !v);
    };
    const handleSideSort = () => {
        if (sideAsc) {
            setSideMenu([...sideMenu].sort((a, b) => b.id - a.id));
        } else {
            setSideMenu([...sideMenu].sort((a, b) => a.id - b.id));
        }
        setSideAsc((v) => !v);
    };

    return (
        <main className="w-full max-w-xl mx-auto px-2 sm:px-4 py-8">
            {/* タブUI */}
            <div className="flex justify-center mb-6">
                {["配置登録", "登録内容変更", "新規追加"].map((label, idx) => (
                    <button
                        key={label}
                        type="button"
                        className={`px-6 py-2 text-sm font-semibold border-b-2 transition-colors duration-150 focus:outline-none ${
                            activeTab === idx
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-blue-500"
                        }`}
                        onClick={() => setActiveTab(idx)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* タブごとの画面 */}
            {activeTab === 0 && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-3 gap-6 w-full">
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
                        登録内容変更（画像編集）
                    </h2>
                    <p className="mb-2 text-sm text-gray-500">
                        画像のタイトルやタグなどを編集できます（仮UI）。
                    </p>
                    {/* ここに編集フォームやリストを追加 */}
                    <div className="text-gray-400 text-sm">
                        ※この画面のUIは今後拡張可能です
                    </div>
                </div>
            )}
            {activeTab === 2 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">
                        新規画像追加
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

type MenuSectionProps = {
    title: string;
    items: ImageItem[];
    apiOrigin: string;
    droppableId: string;
    sectionClass?: string;
    sortAsc?: boolean;
    onToggleSort?: () => void;
    onRegisterOrder?: () => void;
    droppableType?: string;
};

function MenuSection({
    title,
    items,
    apiOrigin,
    droppableId,
    sectionClass = "",
    droppableType = "",
    sortAsc,
    onToggleSort,
    onRegisterOrder,
}: MenuSectionProps) {
    // 管理画面ではitemsが空でも必ずセクションを表示
    function nl2br(str: string) {
        return str.split(/\r?\n/).map((line, idx, arr) =>
            idx < arr.length - 1 ? (
                <React.Fragment key={idx}>
                    {line}
                    <br />
                </React.Fragment>
            ) : (
                <React.Fragment key={idx}>{line}</React.Fragment>
            )
        );
    }
    // リスト型DnD: 1カラム縦並び
    return (
        <section className={`flex-1 min-w-0 ${sectionClass}`}>
            <div className="flex flex-col items-center mt-8 mb-4">
                <h2 className="text-lg font-bold text-gray-700 text-center mb-2">
                    {title}
                </h2>
                {onToggleSort && typeof sortAsc === "boolean" && (
                    <button
                        type="button"
                        className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 mb-1"
                        onClick={onToggleSort}
                    >
                        登録IDで{sortAsc ? "降順" : "昇順"}に並び替え
                    </button>
                )}
                {onRegisterOrder && (
                    <button
                        type="button"
                        className="text-xs px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white mt-1"
                        onClick={onRegisterOrder}
                    >
                        DBに登録
                    </button>
                )}
            </div>
            <Droppable
                droppableId={droppableId}
                direction="vertical"
                type={droppableType}
            >
                {(provided) => (
                    <div
                        className="flex flex-col gap-4 mt-6 min-h-[320px] bg-white transition-colors duration-200"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {items.length === 0 ? (
                            <div className="w-full aspect-square bg-white overflow-hidden rounded-3xl flex items-center justify-center text-gray-300 text-sm select-none border-2 border-dashed border-gray-200">
                                登録がありません
                            </div>
                        ) : (
                            items.map((item, idx) => {
                                const imageUrl = `${apiOrigin}/images/${item.file_path}`;
                                return (
                                    <Draggable
                                        key={item.id}
                                        draggableId={String(item.id)}
                                        index={idx}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={
                                                    snapshot.isDragging
                                                        ? "scale-105 opacity-70 shadow-lg rounded-3xl transition-all duration-200"
                                                        : ""
                                                }
                                            >
                                                <div className="bg-white overflow-hidden rounded-3xl flex flex-col items-center">
                                                    <div className="w-full aspect-square overflow-hidden rounded-3xl">
                                                        <img
                                                            className="w-full h-full object-cover rounded-3xl transition-transform duration-200 hover:scale-105"
                                                            src={imageUrl}
                                                            alt={
                                                                item.alt_text ||
                                                                item.title
                                                            }
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div className="w-full text-center font-semibold mt-2 px-2 py-1 break-words text-[clamp(0.75rem,2vw,1rem)] text-gray-700 min-h-[3em] max-h-[3em] flex items-center justify-center leading-snug line-clamp-2">
                                                        {nl2br(item.title)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </section>
    );
}

export default App;
