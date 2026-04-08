<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchantMetric extends Model
{
    protected $fillable =[
        'merchant_id',
        'average_rating',
        'rating_count',
        'completed_jobs',
        'cancelled_jobs',
        'last_calculated_at',
        'extras',
    ];

    protected function casts(){
        return [
            'average_rating'=> 'decimal:2',
            'rating_count'=> 'integer',
            'completed_jobs'=> 'integer',
            'cancelled_jobs'=> 'integer',
            'last_calculated_at'=> 'datetime',
            'extras'=> 'array',
        ];
    }

    public function merchant(){
        return $this->belongsTo(Merchant::class);
    }
}
