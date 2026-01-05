<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAiToolRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('ai_tools', 'name')->ignore($this->ai_tool),
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('ai_tools', 'slug')->ignore($this->ai_tool),
            ],
            'description' => 'required|string|max:1000',
            'long_description' => 'nullable|string|max:5000',
            'url' => 'nullable|url|max:500',
            'api_endpoint' => 'nullable|url|max:500',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'version' => 'nullable|string|max:20',
            'status' => 'nullable|in:active,inactive,maintenance,beta',
            'is_active' => 'boolean',
            'requires_auth' => 'boolean',
            'api_key_required' => 'boolean',
            'is_approved' => 'boolean',
            'usage_limit' => 'nullable|integer|min:0',
            'metadata' => 'nullable|array',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The tool name is required.',
            'name.unique' => 'A tool with this name already exists.',
            'slug.required' => 'The slug is required.',
            'slug.unique' => 'A tool with this slug already exists.',
            'slug.regex' => 'The slug may only contain lowercase letters, numbers, and hyphens.',
            'description.required' => 'The description is required.',
            'url.url' => 'The URL must be a valid URL.',
            'api_endpoint.url' => 'The API endpoint must be a valid URL.',
            'categories.*.exists' => 'One or more selected categories are invalid.',
            'roles.*.exists' => 'One or more selected roles are invalid.',
            'tags.*.exists' => 'One or more selected tags are invalid.',
        ];
    }
}
