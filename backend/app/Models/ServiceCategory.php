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
        'extras',
    ];

    protected function casts(){
        return[
            'is_active'=> 'boolean',
        ];
    }

    public function category(){
        return $this->hasOne(ServiceCategory::class);
    }

}
