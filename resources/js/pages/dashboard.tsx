import ExpenseChart from '@/components/ExpenseChart';
import { dashboard } from '@/routes';
import transaction from '@/routes/transaction';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
    currentDate: string;
}

export default function Dashboard({ transactions, currentDate }: DashboardProps) {
    const { data, setData, post, processing, errors } = useForm({ text: '' });
    const [advice, setAdvice] = useState<string | null>(null);
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(transaction.magic().url, { onSuccess: () => setData('text', '') });
    };

    const formatRupiah = (n: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    const handleAnalyze = async () => {
        setLoadingAdvice(true);
        setAdvice(null);
        try {
            const res = await axios.post(transaction.analyze().url, { custom_prompt: customPrompt });
            setAdvice(res.data.advice);
        } catch { setAdvice('Gagal menghubungi AI.'); }
        finally { setLoadingAdvice(false); }
    };

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount), 0);
        const expense = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount), 0);
        return { totalIncome: income, totalExpense: expense, balance: income - expense };
    }, [transactions]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        router.get(dashboard().url, { date: e.target.value }, { preserveState: true, preserveScroll: true });

    const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <Head title="Dashboard" />

            {/* Ambient glow blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-violet-900/25 blur-[130px]" />
                <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-900/25 blur-[130px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">

                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-400 mb-1">Finance Dashboard</p>
                        <h1 className="text-2xl md:text-3xl font-black">
                            Laporan{' '}
                            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                Keuangan
                            </span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm">
                        <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <input type="month" value={currentDate} onChange={handleDateChange}
                            className="bg-transparent border-none text-sm font-semibold text-white focus:ring-0 focus:outline-none cursor-pointer" />
                    </div>
                </div>

                {/* ── STAT CARDS ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Balance – gradient border card */}
                    <div className="col-span-2 lg:col-span-1 group relative rounded-2xl p-px bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-950/40">
                        <div className="rounded-2xl bg-[#0d0d1a] p-5 h-full">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">Sisa Saldo</p>
                            <p className={`text-2xl font-black ${balance < 0 ? 'text-rose-400' : 'text-white'}`}>{formatRupiah(balance)}</p>
                            <div className="mt-4 space-y-1">
                                <div className="flex justify-between text-[10px] text-zinc-500">
                                    <span>Savings rate</span><span className="text-zinc-300 font-semibold">{savingsRate}%</span>
                                </div>
                                <div className="bg-white/10 rounded-full h-1 overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full"
                                        style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Income */}
                    <div className="col-span-1 rounded-2xl bg-emerald-950/40 border border-emerald-900/50 hover:border-emerald-700/60 transition-colors p-5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-3">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">Pemasukan</p>
                        <p className="text-xl font-black text-emerald-400 leading-none">{formatRupiah(totalIncome)}</p>
                        <p className="text-[10px] text-zinc-600 mt-2">{transactions.filter(t => t.type === 'Income').length} transaksi</p>
                    </div>

                    {/* Expense */}
                    <div className="col-span-1 rounded-2xl bg-rose-950/40 border border-rose-900/50 hover:border-rose-700/60 transition-colors p-5">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center mb-3">
                            <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">Pengeluaran</p>
                        <p className="text-xl font-black text-rose-400 leading-none">{formatRupiah(totalExpense)}</p>
                        <p className="text-[10px] text-zinc-600 mt-2">{transactions.filter(t => t.type === 'Expense').length} transaksi</p>
                    </div>

                    {/* Count */}
                    <div className="col-span-2 lg:col-span-1 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 hover:border-indigo-700/60 transition-colors p-5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-3">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1">Total Transaksi</p>
                        <p className="text-3xl font-black text-white leading-none">{transactions.length}</p>
                        <p className="text-[10px] text-zinc-600 mt-2">bulan ini</p>
                    </div>
                </div>

                {/* ── CHART + AI ADVISOR ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-[#0d0d1a] border border-white/5 p-6 shadow-xl">
                        <ExpenseChart transactions={transactions} />
                    </div>

                    <div className="rounded-2xl bg-[#0d0d1a] border border-white/5 p-6 shadow-xl flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg shadow-lg shadow-violet-900/40">🤖</div>
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d0d1a] animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">AI Financial Advisor</h3>
                                <p className="text-xs text-zinc-500">Analisis kustom berbasis AI</p>
                            </div>
                        </div>

                        <textarea
                            className="w-full rounded-xl bg-white/5 border border-white/8 text-sm text-zinc-200 placeholder-zinc-600 p-3 resize-none focus:border-violet-500/60 focus:ring-0 focus:outline-none transition-colors"
                            rows={3}
                            placeholder="Contoh: 'Analisis pengeluaranku dan beri tips hemat...'"
                            value={customPrompt}
                            onChange={e => setCustomPrompt(e.target.value)}
                        />

                        <button onClick={handleAnalyze} disabled={loadingAdvice}
                            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-900/30 active:scale-[0.98]">
                            {loadingAdvice
                                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Menganalisis...</>
                                : <>Kirim ke AI 🚀</>}
                        </button>

                        {advice && (
                            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">
                                <p className="text-[10px] font-bold tracking-widest uppercase text-violet-400 mb-2">💡 Jawaban AI</p>
                                <div className="text-sm leading-relaxed text-zinc-300 prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{advice}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── MAGIC INPUT ── */}
                <div className="relative rounded-2xl p-px shadow-2xl shadow-violet-950/50"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #6366f1)' }}>
                    <div className="relative rounded-2xl bg-[#0d0d1a] p-6 md:p-8 overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xl shadow-lg shadow-violet-900/40 shrink-0">✨</div>
                            <div>
                                <h3 className="font-bold text-white">AI Magic Recorder</h3>
                                <p className="text-xs text-zinc-500">Ceritakan transaksimu dengan bahasa natural</p>
                            </div>
                        </div>
                        <form onSubmit={submit}>
                            <textarea
                                className="w-full rounded-xl bg-white/5 border border-white/10 text-zinc-200 placeholder-zinc-600 p-4 resize-none focus:border-violet-500/50 focus:ring-0 focus:outline-none text-sm leading-relaxed transition-colors"
                                rows={3}
                                placeholder="Contoh: Dapet gaji 5jt, tapi langsung bayar kosan 1.5jt dan beli kopi 25rb..."
                                value={data.text}
                                onChange={e => setData('text', e.target.value)}
                                disabled={processing}
                            />
                            {errors.text && <p className="mt-2 text-sm text-rose-400">{errors.text}</p>}
                            <div className="mt-4 flex justify-end">
                                <button type="submit" disabled={processing || !data.text}
                                    className="flex items-center gap-2 rounded-xl bg-white text-black px-6 py-2.5 text-sm font-black hover:bg-zinc-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg">
                                    {processing
                                        ? <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Menganalisis...</>
                                        : <>Proses Transaksi ⚡</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* ── TABLE ── */}
                <div className="rounded-2xl bg-[#0d0d1a] border border-white/5 overflow-hidden shadow-xl mb-6">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                        <h3 className="text-sm font-bold text-white">Riwayat Transaksi</h3>
                        <span className="rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold text-zinc-400">{transactions.length} data</span>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-700">
                            <span className="text-5xl mb-3">📭</span>
                            <p className="text-sm font-medium text-zinc-500">Belum ada data transaksi</p>
                            <p className="text-xs mt-1">Gunakan Magic Recorder di atas untuk mulai mencatat</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        {['Tanggal', 'Item', 'Kategori', 'Nominal', 'Aksi'].map((h, i) => (
                                            <th key={h} className={`px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-zinc-600 ${i >= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(trx => (
                                        <tr key={trx.id} className="group border-b border-white/[0.03] hover:bg-white/[0.025] transition-colors">
                                            <td className="px-6 py-4 text-xs text-zinc-500 whitespace-nowrap">
                                                {new Date(trx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-zinc-200 whitespace-nowrap">{trx.item_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                                                    trx.type === 'Income'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${trx.type === 'Income' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                    {trx.category}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right text-sm font-black whitespace-nowrap tabular-nums ${trx.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {trx.type === 'Income' ? '+' : '-'} {formatRupiah(trx.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button onClick={() => { if (confirm('Yakin mau hapus?')) router.delete(transaction.destroy({ id: trx.id }).url); }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 inline-flex items-center justify-center text-rose-400 hover:text-rose-300 ml-auto"
                                                    title="Hapus">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
