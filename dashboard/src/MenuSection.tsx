import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { ImageItem } from "./components/ImageEditSection";

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

const MenuSection: React.FC<MenuSectionProps> = (props) => {
    const {
        title,
        items,
        apiOrigin,
        droppableId,
        sectionClass = "",
        droppableType = "",
        sortAsc,
        onToggleSort,
        onRegisterOrder,
    } = props;
    // 管理画面ではitemsが空でも必ずセクションを表示
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
                                                    <div className="w-full aspect-square overflow-hidden rounded-3xl relative">
                                                        <img
                                                            className="w-full h-full object-cover rounded-3xl transition-transform duration-200 hover:scale-105"
                                                            src={imageUrl}
                                                            alt={
                                                                item.alt_text ||
                                                                item.title
                                                            }
                                                            loading="lazy"
                                                            decoding="async"
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
};

export default MenuSection;
