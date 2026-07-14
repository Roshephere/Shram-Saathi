<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'merchant_id' => $this->merchant_id,
            'user_id' => $this->user_id,
            'service_request_id' => $this->service_request_id,
            'rating_overall' => $this->rating_overall,
            'rating_skill' => $this->rating_skill,
            'rating_timeliness' => $this->rating_timeliness,
            'rating_communication' => $this->rating_communication,
            'review_text' => $this->review_text,
            'is_verified' => $this->is_verified,
            'extras' => $this->extras,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'merchant' => $this->whenLoaded('merchant', fn() => [
                'id' => $this->merchant->id,
                'business_name' => $this->merchant->business_name,
            ]),
        ];
    }
}
