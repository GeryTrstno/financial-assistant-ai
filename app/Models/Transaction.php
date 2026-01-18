<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'item_name',
        'type',
        'category',
        'amount',
        'description'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
