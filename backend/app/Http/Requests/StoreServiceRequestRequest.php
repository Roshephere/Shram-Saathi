<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequestRequest extends FormRequest
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
            'category_id' => 'required|integer|exists:service_categories,id',
            'user_location_id' => 'required|integer|exists:user_locations,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'budget_min' => 'required|numeric|min:0',
            'budget_max' => 'required|numeric|gte:budget_min',
            'currency' => 'required|string|in:INR,USD,EUR',
            'urgency' => 'required|integer|in:1,2,3,4,5',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'location_text' => 'required|string|max:500',
            'extras' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Service category is required',
            'category_id.exists' => 'Selected service category does not exist',
            'title.required' => 'Request title is required',
            'budget_max.gte' => 'Maximum budget must be greater than or equal to minimum budget',
            'urgency.in' => 'Urgency must be between 1 and 5',
        ];
    }
}
