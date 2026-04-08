<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRequestSkill extends Model
{
    protected $fillable =[
        'service_requrest_id',
        'skill_id',
        'required_level',
        'importance_wt',
        'is_mandatory',
        'extras',
    ];

    protected function casts(){
        return [
            'is_mandatory'=> 'boolean',
            'extras'=> 'array',
        ];
    }

    public function serviceRequest(){
        return $this->belongsTo(ServiceRequest::class);
    }

    public function skill(){
        return $this->belongsTo(Skill::class);
    }
}

