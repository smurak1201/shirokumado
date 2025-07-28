import { useEffect, useState } from "react";

type ImageItem = {
    id: number;
    title: string;
    file_path: string;
    alt_text?: string;
    tag_name?: string;
    category_name?: string;
};

function App() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/images")
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
    }, []);

    // カテゴリー・タグごとにフィルタ
    const limitedMenu = images.filter((img) => img.tag_name === "限定メニュー");
    const normalMenu = images.filter((img) => img.tag_name === "通常メニュー");
    const sideMenu = images.filter(
        (img) => img.category_name === "サイドメニュー"
    );

    if (loading) return <div className="text-center py-8">読み込み中...</div>;
    if (error)
        return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto px-2 py-8">
            <MenuSection title="限定メニュー" items={limitedMenu} />
            <MenuSection title="通常メニュー" items={normalMenu} />
            <MenuSection title="サイドメニュー" items={sideMenu} />
        </div>
    );
}

function MenuSection({ title, items }: { title: string; items: ImageItem[] }) {
    if (!items.length) return null;
    return (
        <section className="mb-12">
            <h2 className="text-lg font-bold text-gray-700 mt-8 mb-4 text-center">
                {title}
            </h2>
            <div className="grid grid-cols-3 items-stretch mt-6 gap-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white overflow-hidden rounded-3xl flex flex-col items-center"
                    >
                        <div className="w-full aspect-square overflow-hidden">
                            <img
                                className="w-full h-full object-cover rounded-3xl transition-transform duration-200 hover:scale-105"
                                src={"/images/" + item.file_path}
                                alt={item.alt_text || item.title}
                                loading="lazy"
                            />
                        </div>
                        <div className="w-full text-center font-semibold mt-2 px-2 py-1 break-words text-[clamp(0.75rem,2vw,1rem)] text-gray-700">
                            {item.title}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default App;
