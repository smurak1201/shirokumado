import React from "react";

interface PaginationProps {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    current,
    total,
    pageSize,
    onChange,
}) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = pageSize * (current - 1) + 1;
    const end = Math.min(current * pageSize, total);
    return (
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
                全{total}件中 {start}～{end}件を表示
            </span>
            <div className="flex gap-2">
                <button
                    className="px-2 py-1 border rounded text-sm"
                    disabled={current === 1}
                    onClick={() => onChange(current - 1)}
                >
                    前へ
                </button>
                <span className="px-2 text-sm">
                    {current} / {totalPages}
                </span>
                <button
                    className="px-2 py-1 border rounded text-sm"
                    disabled={current >= totalPages}
                    onClick={() => onChange(current + 1)}
                >
                    次へ
                </button>
            </div>
        </div>
    );
};

export default Pagination;
