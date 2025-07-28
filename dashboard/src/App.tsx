type ImageItem = {
    id: number;
    title: string;
    file_path: string;
    alt_text?: string;
};

// ダミーデータ
const limitedMenu: ImageItem[] = [
    { id: 1, title: "限定1", file_path: "sample1.jpg" },
    { id: 2, title: "限定2", file_path: "sample2.jpg" },
    { id: 3, title: "限定3", file_path: "sample3.jpg" },
];
const normalMenu: ImageItem[] = [
    { id: 4, title: "通常1", file_path: "sample4.jpg" },
    { id: 5, title: "通常2", file_path: "sample5.jpg" },
    { id: 6, title: "通常3", file_path: "sample6.jpg" },
];
const sideMenu: ImageItem[] = [
    { id: 7, title: "サイド1", file_path: "sample7.jpg" },
    { id: 8, title: "サイド2", file_path: "sample8.jpg" },
];

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

function App() {
    return (
        <div className="max-w-5xl mx-auto px-2 py-8">
            <MenuSection title="限定メニュー" items={limitedMenu} />
            <MenuSection title="通常メニュー" items={normalMenu} />
            <MenuSection title="サイドメニュー" items={sideMenu} />
        </div>
    );
}

export default App;
