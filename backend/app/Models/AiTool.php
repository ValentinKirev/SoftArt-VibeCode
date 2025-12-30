<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiTool extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'tool_type',
        'url',
        'documentation_url',
        'github_url',
        'author_name',
        'author_email',
        'team',
        'tags',
        'use_case',
        'pros',
        'cons',
        'rating',
        'is_active'
    ];

    protected $casts = [
        'tags' => 'array',
        'is_active' => 'boolean',
        'rating' => 'integer',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('tool_type', $type);
    }

    public function scopeByTeam($query, $team)
    {
        return $query->where('team', $team);
    }
}
