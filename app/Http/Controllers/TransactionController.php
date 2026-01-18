<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use OpenAI\Laravel\Facades\OpenAI;

class TransactionController extends Controller
{

    // GET
    public function index(Request $request)
    {
        $selectedDate = $request->input('date', now()->format('Y-m')); 
        
        list($year, $month) = explode('-', $selectedDate);

        $transactions = Transaction::where('user_id', auth()->id())
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->latest('date')
            ->get();

        return Inertia::render('dashboard', [
            'transactions' => $transactions,
            'currentDate' => $selectedDate,
        ]);
    }


    // DESTROY
    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);

        if ($transaction->user_id !== auth()->id()) {
            abort(403);
        }

        $transaction->delete();

        return redirect()->back()->with('message', 'Transaksi berhasil dihapus.');
    }

    // POST
    public function parseAndSave(Request $request)
    {
        $request->validate(['text' => 'required|string']);

        $result = OpenAI::chat()->create([
            'model' => 'gpt-5-mini-2025-08-07',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Kamu adalah asisten ekstraksi data keuangan. Output JSON: {"transactions": [{
                    "item_name": string, 
                    "amount": int, 
                    "category": "Food/Needs/Home/Entertainment", 
                    "type": "Expense/Income",
                    "description": string
                    }]}. Hanya JSON.'
                ],
                ['role' => 'user', 'content' => $request->text],
            ],
            'response_format' => ['type' => 'json_object'],
        ]);


        $content = $result->choices[0]->message->content;

        $data = json_decode($content, true);

        foreach ($data['transactions'] as $trx) {
            Transaction::create([
                'user_id' => auth()->id(),
                'item_name' => $trx['item_name'],
                'amount' => $trx['amount'],
                'category' => $trx['category'],
                'type' => $trx['type'],
                'description' => $trx['description'],
                'date' => now(),
            ]);
        }

        return redirect()->back()->with('message', 'Berhasil mencatat transaksi!');
    }

    // POST
    public function analyze(Request $request)
    {
        $userId = auth()->id();
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $transactions = Transaction::where('user_id', $userId)
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->get();

        if ($transactions->isEmpty()) {
            return response()->json(['advice' => 'Belum ada data transaksi bulan ini. Catat dulu pengeluaranmu!']);
        }

        $totalIncome = $transactions->where('type', 'Income')->sum('amount');
        $totalExpense = $transactions->where('type', 'Expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        $expenseBreakdown = $transactions->where('type', 'Expense')
            ->groupBy('category')
            ->map(fn($row) => $row->sum('amount'))
            ->toArray();

        $expenseString = "";

        foreach ($expenseBreakdown as $category => $amount) {
            $expenseString .= "- $category: Rp" . number_format($amount, 0, ',', '.') . "\n";
        }

        // 1. Ambil prompt dari user (frontend)
        $userCustomPrompt = $request->input('custom_prompt');

        // 2. Jika user kosongkan input, pakai prompt default
        if (empty($userCustomPrompt)) {
            $userCustomPrompt = "Berikan analisis singkat, padat, dan jelas tentang kesehatan keuangan saya.";
        }

        // 3. GABUNGKAN Prompt User + Data Keuangan
        // Ini penting! User cuma kasih perintah gaya bicara, kita yang kasih datanya.
        $finalPrompt = "
        $userCustomPrompt
        
        --- DATA KEUANGAN PENGGUNA (JANGAN DIUBAH) ---
        - Total Pemasukan: Rp " . number_format($totalIncome, 0, ',', '.') . "
        - Total Pengeluaran: Rp " . number_format($totalExpense, 0, ',', '.') . "
        - Sisa Saldo: Rp " . number_format($balance, 0, ',', '.') . "
        
        Rincian per Kategori:
        $expenseString
        -----------------------------------------------
        Jawablah permintaan user di atas berdasarkan data ini.
        ";

        $result = OpenAI::chat()->create([
            'model' => 'gpt-5-mini-2025-08-07',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful financial assistant.'],
                ['role' => 'user', 'content' => $finalPrompt],
            ],
        ]);

        return response()->json([
            'advice' => $result->choices[0]->message->content
        ]);
    }

    
}
