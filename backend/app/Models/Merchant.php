<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    protected $fillable = ['user_id', 'business_name', 'phone', 'logo', 'pan_no', 'location', 'status', 'avg_rating','hourly_rate', 'extras', 'verified_at'];

    protected $casts = [
        'extras' => 'array',
        'verified_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'merchant_skill');
    }
    public function category(){
        return $this->hasMany(MerchantCategory::class);
    }
}
