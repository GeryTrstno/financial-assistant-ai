<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use OpenAI\Laravel\Facades\OpenAI;

class TransactionController extends Controller
{

    // GET
    public function index()
    {
        return Inertia::render('dashboard', [
            'transactions' => Transaction::where('user_id', auth()->id())
                ->latest()
                ->get()
        ]);
    }

    // POST
    public function parseAndSave(Request $request)
    {
        $request->validate(['text' => 'required|string']);

        $result = OpenAI::chat()->create([
            'model' => 'gpt-5-nano-2025-08-07',
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
}
