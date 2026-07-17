<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'booking_id',
        'merchant_id',
        'service_amount',
        'commission_rate',
        'commission_amount',
        'merchant_amount',
        'status',
        'payment_method',
        'notes',
        'customer_confirmed_at',
        'merchant_confirmed_at',
        'completed_at',
    ];

    protected $casts = [
        'service_amount' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'merchant_amount' => 'decimal:2',
        'completed_at' => 'datetime',
        'customer_confirmed_at' => 'datetime',
        'merchant_confirmed_at' => 'datetime',
    ];

    public function booking() :BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function merchant() :BelongsTo
    {
        return $this->belongsTo(Merchant::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
