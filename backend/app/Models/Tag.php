<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the AI tools that belong to this tag.
     */
    public function aiTools(): BelongsToMany
    {
        return $this->belongsToMany(AiTool::class, 'ai_tool_tag')
            ->withTimestamps();
    }

    /**
     * Get the roles that can access this tag.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'tag_role')
            ->withTimestamps();
    }

    /**
     * Scope to get only active tags.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order tags by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('name', 'asc');
    }

    /**
     * Get the formatted color attribute.
     */
    public function getFormattedColorAttribute(): string
    {
        return $this->color ?? '#6B7280';
    }

    /**
     * Get the formatted icon attribute.
     */
    public function getFormattedIconAttribute(): string
    {
        return $this->icon ?? '🏷️';
    }
}
