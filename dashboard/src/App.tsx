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

function App() {
    const apiOrigin = import.meta.env.VITE_API_ORIGIN;
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${apiOrigin}/api/images`)
            .then((res) => {
                if (!res.ok) throw new Error("API error");
                return res.json();
            })
            .then((data) => {
                setImages(data);
                setLoading(false);
            })
            .catch(() => {
                setError("データの取得に失敗しました");
                setLoading(false);
            });
    }, [apiOrigin]);

    // Bladeのロジックと同じ順序で各カテゴリをソート
    const limitedMenu = sortMenu(
        images.filter((img) => img.tag_name === "限定メニュー")
    );
    const normalMenu = sortMenu(
        images.filter((img) => img.tag_name === "通常メニュー")
    );
    const sideMenu = sortMenu(
        images.filter((img) => img.category_name === "サイドメニュー")
    );

    if (loading) return <div className="text-center py-8">読み込み中...</div>;
    if (error)
        return <div className="text-center py-8 text-red-500">{error}</div>;

    // Bladeのbody背景色を再現
    return (
        <main className="w-full max-w-xl mx-auto px-2 sm:px-4 py-8">
            <MenuSection
                title="限定メニュー"
                items={limitedMenu}
                apiOrigin={apiOrigin}
                sectionOrder={0}
            />
            <MenuSection
                title="通常メニュー"
                items={normalMenu}
                apiOrigin={apiOrigin}
                sectionOrder={1}
            />
            <MenuSection
                title="サイドメニュー"
                items={sideMenu}
                apiOrigin={apiOrigin}
                sectionOrder={2}
            />
        </main>
    );
}

function MenuSection({
    title,
    items,
    apiOrigin,
    sectionOrder,
}: {
    title: string;
    items: ImageItem[];
    apiOrigin: string;
    sectionOrder: number;
}) {
    if (!items.length) return null;
    // Bladeのnl2br(e($image->title))相当の処理
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
    // 2つ目以降のh2はmt-12
    const h2Class = `text-lg font-bold text-gray-700 ${
        sectionOrder === 0 ? "mt-8" : "mt-12"
    } mb-4 text-center`;
    return (
        <section className="mb-12">
            <h2 className={h2Class}>{title}</h2>
            <div className="grid grid-cols-3 items-stretch mt-6 gap-2">
                {items.map((item) => {
                    const imageUrl = `${apiOrigin}/images/${item.file_path}`;
                    const detailUrl = `/images/${item.id}`;
                    return (
                        <a key={item.id} href={detailUrl} className="w-full">
                            <div className="bg-white overflow-hidden rounded-3xl flex flex-col items-center">
                                <div className="w-full aspect-square overflow-hidden rounded-3xl">
                                    <img
                                        className="w-full h-full object-cover rounded-3xl transition-transform duration-200 hover:scale-105"
                                        src={imageUrl}
                                        alt={item.alt_text || item.title}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="w-full text-center font-semibold mt-2 px-2 py-1 break-words text-[clamp(0.75rem,2vw,1rem)] text-gray-700">
                                    {nl2br(item.title)}
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}

export default App;
