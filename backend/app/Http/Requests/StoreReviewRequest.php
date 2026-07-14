<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'booking_id' => 'required|exists:bookings,id',
            'rating_overall' => 'required|numeric|min:1|max:5',
            'rating_skill' => 'nullable|numeric|min:1|max:5',
            'rating_timeliness' => 'nullable|numeric|min:1|max:5',
            'rating_communication' => 'nullable|numeric|min:1|max:5',
            'review_text' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'booking_id.required' => 'Booking ID is required',
            'booking_id.exists' => 'Booking not found',
            'rating_overall.required' => 'Overall rating is required',
            'rating_overall.min' => 'Rating must be at least 1',
            'rating_overall.max' => 'Rating cannot exceed 5',
            'review_text.max' => 'Review cannot exceed 500 characters',
        ];
    }
}
