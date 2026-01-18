import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import transaction from '@/routes/transaction';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    transactions: Array<{
        id: number;
        item_name: string;
        amount: number;
        category: string;
        type: 'Expense' | 'Income';
        description: string;
        date: string;
        created_at: string;
    }>;
}

export default function Dashboard({ transactions }: DashboardProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        text: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(transaction.magic().url, {
            onSuccess: () => setData('text', ''),
        });
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Menggunakan useMemo agar tidak dihitung ulang setiap kali ketik (re-render)
    const { totalIncome, totalExpense, balance } = useMemo(() => {
        const income = transactions
            .filter((t) => t.type === 'Income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expense = transactions
            .filter((t) => t.type === 'Expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return {
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense,
        };
    }, [transactions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-col gap-6 p-4 md:p-6">
                {/* --- BAGIAN 1: KARTU RINGKASAN (STATS) --- */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Kartu Saldo */}
                    <div className="rounded-xl border-l-4 border-indigo-500 bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            Sisa Saldo
                        </p>
                        <p
                            className={`mt-2 text-2xl font-bold ${balance < 0 ? 'text-red-500' : 'text-zinc-900 dark:text-zinc-100'}`}
                        >
                            {formatRupiah(balance)}
                        </p>
                    </div>

                    {/* Kartu Pemasukan */}
                    <div className="rounded-xl border-l-4 border-emerald-500 bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            Total Pemasukan
                        </p>
                        <p className="mt-2 text-2xl font-bold text-emerald-600">
                            + {formatRupiah(totalIncome)}
                        </p>
                    </div>

                    {/* Kartu Pengeluaran */}
                    <div className="rounded-xl border-l-4 border-rose-500 bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            Total Pengeluaran
                        </p>
                        <p className="mt-2 text-2xl font-bold text-rose-600">
                            - {formatRupiah(totalExpense)}
                        </p>
                    </div>
                </div>

                {/* --- BAGIAN 2: MAGIC INPUT AI --- */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-1 shadow-lg">
                    <div className="rounded-xl bg-white p-6 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="text-2xl">✨</span>
                            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                                AI Magic Recorder
                            </h3>
                        </div>

                        <form onSubmit={submit} className="relative">
                            <textarea
                                className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 text-zinc-700 shadow-inner transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                                rows={3}
                                placeholder="Contoh: Dapet gaji 5jt, tapi langsung bayar kosan 1.5jt dan beli kopi 25rb..."
                                value={data.text}
                                onChange={(e) =>
                                    setData('text', e.target.value)
                                }
                                disabled={processing}
                            />

                            {/* Error Message jika ada */}
                            {errors.text && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.text}
                                </p>
                            )}

                            <div className="mt-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing || !data.text}
                                    className={`flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300`}
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="h-4 w-4 animate-spin"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Menganalisis...
                                        </>
                                    ) : (
                                        <>Proses Transaksi ⚡</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- BAGIAN 3: TABEL RIWAYAT --- */}
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <h3 className="font-bold text-zinc-700 dark:text-zinc-200">
                            Riwayat Transaksi
                        </h3>
                        <span className="rounded-md bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            {transactions.length} Data
                        </span>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                            <span className="mb-2 text-4xl">📭</span>
                            <p>Belum ada data transaksi.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                                <thead className="bg-zinc-50 dark:bg-zinc-950">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                                            Item
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                                            Nominal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                                    {transactions.map((trx) => (
                                        <tr
                                            key={trx.id}
                                            className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-zinc-500 dark:text-zinc-400">
                                                {new Date(
                                                    trx.date,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-zinc-900 dark:text-zinc-100">
                                                {trx.item_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs leading-5 font-semibold ${
                                                        trx.type === 'Income'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                                                    }`}
                                                >
                                                    {trx.category}
                                                </span>
                                            </td>
                                            <td
                                                className={`px-6 py-4 text-right text-sm font-bold whitespace-nowrap ${
                                                    trx.type === 'Income'
                                                        ? 'text-emerald-600'
                                                        : 'text-red-500'
                                                }`}
                                            >
                                                {trx.type === 'Income'
                                                    ? '+'
                                                    : '-'}{' '}
                                                {formatRupiah(trx.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
