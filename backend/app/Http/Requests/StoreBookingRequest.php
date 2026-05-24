<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check(); // Only authenticated users can create bookings
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'service_request_id' => 'required|exists:service_requests,id',
            'merchant_id' => 'required|exists:merchants,id',
            'agreed_rate' => 'required|numeric|min:0',
            'special_notes' => 'nullable|string|max:255',
            'scheduled_at' => 'nullable|date|after:now',
        ];
    }

    public function messages(): array
    {
        return [
            'agreed_rate.required' => 'Agreed rate is required',
            'agreed_rate.numeric' => 'Agreed rate must be a valid amount',
        ];
    }
}
