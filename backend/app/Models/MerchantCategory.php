<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchantCategory extends Model
{
    protected $fillable=[
        'merchant_id',
        'category_id',
        'is_primary',
        'extras',
        
    ];


    protected function casts(){
        return [
            'is_primary' =>'boolean',
            'extras'=> 'array',
        ];
    }

    public function merchant(){
        return $this->belongsTo(Merchant::class);
    }

    public function category(){
        return $this->belongsTo(ServiceCategory::class);
    }
}
