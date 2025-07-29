import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import MenuSection from "./MenuSection";

function App() {
    // DnD終了時の並び替え処理
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
    type ImageItem = {
        id: number;
        title: string;
        file_path: string;
        display_order?: number | null;
        alt_text?: string;
        tag_name?: string;
        category_name?: string;
    };

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
            .then((data: ImageItem[]) => {
                setLimitedMenu(
                    data.filter(
                        (img: ImageItem) => img.tag_name === "限定メニュー"
                    )
                );
                setNormalMenu(
                    data.filter(
                        (img: ImageItem) => img.tag_name === "通常メニュー"
                    )
                );
                setSideMenu(
                    data.filter(
                        (img: ImageItem) =>
                            img.category_name === "サイドメニュー"
                    )
                );
            })
            .catch(() => {
                // データ取得失敗時の処理（必要ならUI追加）
            });
    }, [apiOrigin]);

    // ...existing code...

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
