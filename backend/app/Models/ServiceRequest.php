<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'budget_min',
        'budget_max',
        'currency',
        'urgency',
        'longitude',
        'latitude',
        'location_text',
        'status',
        'extras',
    ];

    protected function casts(){
        return [
            'budget_min'=> 'decimal:2',
            'budget_max'=> 'decimal:2',
            'urgency'=> 'integer',
            'longitude'=> 'decimal:7',
            'latitude'=> 'decimal:7',
            'extras'=> 'array',
        ];
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function category(){
        return $this->belongsTo(ServiceCategory::class);
    }
}
