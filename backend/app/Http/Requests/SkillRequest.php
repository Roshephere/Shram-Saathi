<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SkillRequest extends FormRequest
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
            'name' => 'required|string|max:50|unique:skills,name',
            'description' => 'nullable|string| max:255',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'A skill name is required.',
            'name.string' => 'The skill name must be a valid string.',
            'name.max' => 'The skill name cannot exceed 50 characters.',
            'name.unique' => 'This skill already exists.',
            'description.string' => 'The description must be a valid string.',
            'description.max' => 'The description cannot exceed 255 characters.',
        ];  
    }
}
