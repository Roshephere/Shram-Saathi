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
        // Only merchants can create bids
        return auth()->check() && auth()->user()->merchant;
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
            'proposed_rate' => 'required|numeric|min:0',
            'message' => 'nullable|string|max:255',
            'scheduled_at' => 'nullable|date|after:now',
        ];
    }

    public function messages(): array
    {
        return [
            'proposed_rate.required' => 'Proposed rate is required',
            'proposed_rate.numeric' => 'Proposed rate must be a valid amount',
            'service_request_id.required' => 'Service request is required',
            'service_request_id.exists' => 'Service request not found',
        ];
    }
}
