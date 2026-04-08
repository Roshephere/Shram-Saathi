<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchantLocation extends Model
{
    protected $fillable =[
        'merchant_id',
        'label',
        'country',
        'address',
        'latitude',
        'longitude',
        'is_primary',
        'is_active',
        'extras',
    ];

    protected function casts(){
        return [
            'is_primary'=> 'boolean',
            'is_active'=> 'boolean',
            'extras'=> 'array',
        ];
    }

    public function merchant(){
        return $this->belongsTo(Merchant::class);
    }
}
