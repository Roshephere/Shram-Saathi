<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $serviceCategory = $this->route('service_category');

        $serviceCategoryId = is_object($serviceCategory)
            ? $serviceCategory->id
            : $serviceCategory;

        return [
            'parent_id' => [
                'nullable',
                'exists:service_categories,id',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('service_categories', 'slug')->ignore($serviceCategoryId),
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'order' => [
                'nullable',
                'integer',
            ],

            'extras' => [
                'nullable',
                'array',
            ],
        ];
    }
}