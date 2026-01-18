import { useMemo } from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface Props {
    transactions: Array<{
        amount: number;
        category: string;
        type: string;
    }>;
}

const COLORS = [
    '#6366f1',
    '#ec4899',
    '#8b5cf6',
    '#14b8a6',
    '#f59e0b',
    '#f43f5e',
];

export default function ExpenseChart({ transactions }: Props) {
    // 1. Olah data: Grouping pengeluaran per kategori
    const data = useMemo(() => {
        const expenses = transactions.filter((t) => t.type === 'Expense');

        // Gabungkan kategori yang sama (misal: Food muncul 2x, dijumlahkan)
        const grouped = expenses.reduce(
            (acc, curr) => {
                const existing = acc.find(
                    (item) => item.name === curr.category,
                );
                if (existing) {
                    existing.value += Number(curr.amount);
                } else {
                    acc.push({
                        name: curr.category,
                        value: Number(curr.amount),
                    });
                }
                return acc;
            },
            [] as { name: string; value: number }[],
        );

        return grouped;
    }, [transactions]);

    // Format Rupiah untuk Tooltip
    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    if (data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white p-6 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
                Belum ada data pengeluaran untuk grafik.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-bold text-zinc-800 dark:text-zinc-100">
                📊 Porsi Pengeluaran
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60} // Bikin bolong tengah (Donut)
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [
                                formatRupiah(Number(value)),
                                name,
                            ]}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
