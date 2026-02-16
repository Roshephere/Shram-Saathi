<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable =[
        'name',
        'slug',
        'description',
    ];

    public function merchants(){
        return $this->belongsToMany(Merchant::class, 'merchant_skill');
    }
}
