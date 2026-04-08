<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchantReview extends Model
{
    protected $fillable =[
        'merchant_id',
        'service_request_id',
        'rating_overall',
        'rating_skill',
        'rating_timeliness',
        'rating_communication',
        'review_text',
        'is_verified',
        'extras',
    ];

    protected function casts(){
        return [
            'is_verified' => 'boolean',
            'extras' => 'array',
        ];
    }
}
