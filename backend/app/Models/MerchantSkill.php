<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchantSkill extends Model
{
    protected $fillable = [
        'merchant_id',
        'skill_id',
        'proficiency_level',
        'years_experience',
        'is_primary',
        'extras'
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'extras' => 'array',
    ];

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
