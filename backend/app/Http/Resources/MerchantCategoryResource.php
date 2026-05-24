<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'merchant_id'=>$this->merchant_id,
            'category_id'=> $this->category_id,
            'is_primary'=> $this->is_primary,
            'extras'=> $this->extras,
            'merchant'=> new MerchantResource($this->whenLoaded('merchant')),
            'category'=> new ServiceCategoryResource($this->whenLoaded('category')),
        ];
    }
}
