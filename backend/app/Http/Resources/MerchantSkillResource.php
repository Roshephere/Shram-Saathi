<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantSkillResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'merchant_id' => $this->merchant_id,
            'skill_id' => $this->skill_id,
            'proficiency_level' => $this->proficiency_level,
            'years_experience' => $this->years_experience,
            'is_primary' => $this->is_primary,
            'extras' => $this->extras,
            // 'merchant' => new MerchantResource($this->whenLoaded('merchant')),
            'skill' => new SkillResource($this->whenLoaded('skill')),
        ];
    }
}
