<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchantReview extends Model
{
    protected $fillable =[
        'merchant_id',
        'user_id',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function booking()
    {
        return $this->hasOneThrough(
            Booking::class,
            ServiceRequest::class,
            'id',                // ServiceRequest key
            'service_request_id', // Booking key
            'service_request_id', // Local key on reviews
            'id'                 // Foreign key on service_requests
        );
    }

    public function serviceRequest()
    {
        return $this->belongsTo(ServiceRequest::class);
    }
}
