<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use OpenAI\Laravel\Facades\OpenAI;
use App\Http\Controllers\TransactionController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [TransactionController::class, 'index'])->name('dashboard');

    Route::post('/transaction/magic', [TransactionController::class, 'parseAndSave'])->name('transaction.magic');

    Route::post('/transaction/analyze', [TransactionController::class, 'analyze'])->name('transaction.analyze');
});



require __DIR__.'/settings.php';
