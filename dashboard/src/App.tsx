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
import React, { useEffect, useState } from "react";

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
    const apiOrigin = import.meta.env.VITE_API_ORIGIN;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 並び替え用state（各カテゴリごと）
    const [limitedMenu, setLimitedMenu] = useState<ImageItem[]>([]);
    const [normalMenu, setNormalMenu] = useState<ImageItem[]>([]);
    const [sideMenu, setSideMenu] = useState<ImageItem[]>([]);

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

    // ドラッグ終了時の処理（全カテゴリ共通）
    // グリッドDnD用: ドロップ先をマウス座標から計算
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination } = result;
        let items: ImageItem[] = [];
        let setItems: React.Dispatch<React.SetStateAction<ImageItem[]>>;
        let droppableClass = "";
        if (source.droppableId === "limitedMenu") {
            items = Array.from(limitedMenu);
            setItems = setLimitedMenu;
            droppableClass = ".limitedMenu-droppable";
        } else if (source.droppableId === "normalMenu") {
            items = Array.from(normalMenu);
            setItems = setNormalMenu;
            droppableClass = ".normalMenu-droppable";
        } else if (source.droppableId === "sideMenu") {
            items = Array.from(sideMenu);
            setItems = setSideMenu;
            droppableClass = ".sideMenu-droppable";
        } else {
            return;
        }

        // グリッドDnD: ドロップ位置をマウス座標から計算
        // 1. ドロップ先の親グリッド要素を取得
        // 2. その子要素の位置・サイズから、どこに挿入するかを決定
        // 3. そのインデックスに移動
        // 4. Fallback: 通常のDnD
        let insertIndex = destination.index;
        try {
            const grid = document.querySelector(droppableClass);
            if (grid) {
                const rect = grid.getBoundingClientRect();
                // ドラッグ終了時のマウス座標
                const x =
                    (result as any).clientOffset?.x || (result as any).clientX;
                const y =
                    (result as any).clientOffset?.y || (result as any).clientY;
                if (typeof x === "number" && typeof y === "number") {
                    // 子要素一覧
                    const children = Array.from(grid.children);
                    for (let i = 0; i < children.length; i++) {
                        const c = children[i] as HTMLElement;
                        const cRect = c.getBoundingClientRect();
                        if (y < cRect.bottom && x < cRect.right) {
                            insertIndex = i;
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            // fallback: 何もしない
        }
        const [removed] = items.splice(source.index, 1);
        items.splice(insertIndex, 0, removed);
        setItems(items);
    };

    if (loading) return <div className="text-center py-8">読み込み中...</div>;
    if (error)
        return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <main className="w-full max-w-xl mx-auto px-2 sm:px-4 py-8">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                    <MenuSection
                        title="限定メニュー"
                        items={limitedMenu}
                        apiOrigin={apiOrigin}
                        droppableId="limitedMenu"
                        sectionClass="min-w-[220px] max-w-xs flex-1"
                    />
                    <MenuSection
                        title="通常メニュー"
                        items={normalMenu}
                        apiOrigin={apiOrigin}
                        droppableId="normalMenu"
                        sectionClass="min-w-[220px] max-w-xs flex-1"
                    />
                    <MenuSection
                        title="サイドメニュー"
                        items={sideMenu}
                        apiOrigin={apiOrigin}
                        droppableId="sideMenu"
                        sectionClass="min-w-[220px] max-w-xs flex-1"
                    />
                </div>
            </DragDropContext>
        </main>
    );
}

type MenuSectionProps = {
    title: string;
    items: ImageItem[];
    apiOrigin: string;
    droppableId: string;
    sectionClass?: string;
};

function MenuSection({
    title,
    items,
    apiOrigin,
    droppableId,
    sectionClass = "",
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
            <h2 className="text-lg font-bold text-gray-700 mt-8 mb-4 text-center">
                {title}
            </h2>
            <Droppable droppableId={droppableId} direction="vertical">
                {(provided) => (
                    <div
                        className="flex flex-col gap-4 mt-6 min-h-[320px]"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {items.length === 0 ? (
                            <div className="flex-1 min-h-[220px] flex items-center justify-center text-gray-300 text-sm select-none border-2 border-dashed border-gray-200 rounded-3xl">
                                画像がありません
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
                                                        ? "ring-2 ring-blue-400"
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
                                                    <div className="w-full text-center font-semibold mt-2 px-2 py-1 break-words text-[clamp(0.75rem,2vw,1rem)] text-gray-700">
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
