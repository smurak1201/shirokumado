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

    // ドラッグ終了時の処理
    const onDragEnd = (result: DropResult, menuType: string) => {
        if (!result.destination) return;
        let items: ImageItem[] = [];
        let setItems: React.Dispatch<React.SetStateAction<ImageItem[]>>;
        if (menuType === "限定メニュー") {
            items = Array.from(limitedMenu);
            setItems = setLimitedMenu;
        } else if (menuType === "通常メニュー") {
            items = Array.from(normalMenu);
            setItems = setNormalMenu;
        } else {
            items = Array.from(sideMenu);
            setItems = setSideMenu;
        }
        const [removed] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, removed);
        setItems(items);
    };

    if (loading) return <div className="text-center py-8">読み込み中...</div>;
    if (error)
        return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <main className="w-full max-w-xl mx-auto px-2 sm:px-4 py-8">
            <DragDropContext
                onDragEnd={(result) => onDragEnd(result, "限定メニュー")}
            >
                <MenuSection
                    title="限定メニュー"
                    items={limitedMenu}
                    apiOrigin={apiOrigin}
                    droppableId="limitedMenu"
                />
            </DragDropContext>
            <DragDropContext
                onDragEnd={(result) => onDragEnd(result, "通常メニュー")}
            >
                <MenuSection
                    title="通常メニュー"
                    items={normalMenu}
                    apiOrigin={apiOrigin}
                    droppableId="normalMenu"
                />
            </DragDropContext>
            <DragDropContext
                onDragEnd={(result) => onDragEnd(result, "サイドメニュー")}
            >
                <MenuSection
                    title="サイドメニュー"
                    items={sideMenu}
                    apiOrigin={apiOrigin}
                    droppableId="sideMenu"
                />
            </DragDropContext>
        </main>
    );
}

type MenuSectionProps = {
    title: string;
    items: ImageItem[];
    apiOrigin: string;
    droppableId: string;
};

function MenuSection({
    title,
    items,
    apiOrigin,
    droppableId,
}: MenuSectionProps) {
    if (!items.length) return null;
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
    return (
        <section className="mb-12">
            <h2 className="text-lg font-bold text-gray-700 mt-8 mb-4 text-center">
                {title}
            </h2>
            <Droppable droppableId={droppableId} direction="horizontal">
                {(provided) => (
                    <div
                        className="grid grid-cols-3 items-stretch mt-6 gap-2"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {items.map((item, idx) => {
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
                                                "w-full " +
                                                (snapshot.isDragging
                                                    ? "ring-2 ring-blue-400"
                                                    : "")
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
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </section>
    );
}

export default App;
