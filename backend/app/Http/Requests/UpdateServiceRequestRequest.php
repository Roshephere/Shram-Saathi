<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => 'sometimes|integer|exists:service_categories,id',
            'user_location_id' => 'sometimes|integer|exists:user_locations,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:2000',
            'budget_min' => 'sometimes|numeric|min:0',
            'budget_max' => 'sometimes|numeric|gte:budget_min',
            'currency' => 'sometimes|string|in:INR,USD,EUR',
            'urgency' => 'sometimes|integer|in:1,2,3,4,5',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'location_text' => 'sometimes|string|max:500',
            'status' => 'sometimes|string|in:open,assigned,completed,cancelled',
            'extras' => 'nullable|array',
        ];
    }
}
