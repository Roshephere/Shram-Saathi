<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceCategory extends Model
{
    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'description',
        'is_active',
        'order',
        'extras',
    ];

    protected function casts(){
        return[
            'is_active'=> 'boolean',
        ];
    }

    public function category(){
        return $this->hasOne(ServiceCategory::class, 'parent_id');
    }

    public function merchants(){
        return $this->belongsToMany(Merchant::class, 'merchant_service_categories', 'merchant_id')->withPivot([
            'base_rate', 
            'experience_levels'
        ])->withTimestamps();
    }

    public function parent(){
        return $this->belongsTo(ServiceCategory::class, 'parent_id');
    }

    public function children(){
        return $this->hasMany(ServiceCategory::class, 'parent_id');
    }

}
