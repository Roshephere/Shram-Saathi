<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLocation extends Model
{
    protected $fillable = [
        'user_id',
        'label',
        'country',
        'address',
        'latitude',
        'longitude',
        'is_primary',
        'is_active',
        'extras',
    ];

    protected $casts = [
        'extras' => 'array',
        'is_primary' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class, 'location_id');
    }
}
