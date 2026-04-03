<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray( $request): array
    {
        // dd($this->first->name->name);
        return [
            'id'=> $this?->id,
            'name'=> $this->name,
            'description'=> $this->description,
        ];
    }
}
