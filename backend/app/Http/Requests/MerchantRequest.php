<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MerchantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'user_id' => $this->route('userId'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id'=> 'required|exists:users,id',
            'business_name'=> 'required|string|max:255',
            'phone'=> 'nullable|string|max:20',
            'logo'=> 'nullable|image|max:2048',
            'pan_no'=> 'nullable|string|max:20',
            'location'=> 'nullable|string|max:255',
            'hourly_rate'=> 'nullable|numeric|min:0',
            'service_category_ids' => 'nullable|array',
            'service_category_ids.*' => 'exists:service_categories,id',
            // 'status' => 'in:pending,approved,rejected',
        ];
    }
}
