<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiTool extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'long_description',
        'url',
        'documentation_url',
        'icon',
        'color',
        'version',
        'status',
        'is_active',
        'requires_auth',
        'api_key_required',
        'usage_limit',
        'metadata',
        'is_approved',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'requires_auth' => 'boolean',
        'api_key_required' => 'boolean',
        'usage_limit' => 'integer',
        'metadata' => 'array',
        'is_approved' => 'boolean',
    ];

    /**
     * Get the categories that this AI tool belongs to.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'ai_tool_category')
                    ->withTimestamps();
    }

    /**
     * Get the roles that have access to this AI tool.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'ai_tool_role')
                    ->withTimestamps()
                    ->withPivot(['access_level', 'custom_permissions']);
    }

    /**
     * Get the tags that belong to this AI tool.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'ai_tool_tag')
                    ->withTimestamps();
    }

    /**
     * Get the usage logs for this AI tool.
     */
    public function usageLogs(): HasMany
    {
        return $this->hasMany(AiToolUsage::class);
    }

    /**
     * Get the user favorites for this AI tool.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class);
    }

    /**
     * Scope to get only active tools.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Check if tool is accessible by a specific role.
     */
    public function isAccessibleByRole($roleSlug)
    {
        return $this->roles()->where('slug', $roleSlug)->exists();
    }

    /**
     * Get tool categories as comma-separated string.
     */
    public function getCategoriesListAttribute()
    {
        return $this->categories->pluck('name')->implode(', ');
    }

    /**
     * Get tool roles as comma-separated string.
     */
    public function getRolesListAttribute()
    {
        return $this->roles->pluck('name')->implode(', ');
    }
}
