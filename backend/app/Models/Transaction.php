<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'completed_at',
    ];

    protected $casts = [
        'service_amount' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'merchant_amount' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
