<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecommendationModel extends Model
{
    protected $fillable =[
        'model_name',
        'description',
        'skill_weight',
        'rating_weight',
        'availability_weight',
        'is_active',
        'extras',
    ];

    protected function casts(){
        return [
            'is_active' => 'boolean',
            'extras' => 'array',
        ];
    }
}
