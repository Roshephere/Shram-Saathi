<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MerchantSkillRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'merchant_id' => 'required|integer|exists:merchants,id',
            'skill_id'=> 'required|integer|exists:skills,id',
            'proficiency_level'=> 'required|integer|min:1|max:5',
            'years_experience'=>'required|integer|min:0',
            'is_primary'=>'boolean|nullable',
            'extras'=>'nullable|array',
        ];
    }
}
