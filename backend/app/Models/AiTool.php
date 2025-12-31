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
        'api_endpoint',
        'icon',
        'color',
        'version',
        'status',
        'is_featured',
        'is_active',
        'requires_auth',
        'api_key_required',
        'usage_limit',
        'sort_order',
        'metadata',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'requires_auth' => 'boolean',
        'api_key_required' => 'boolean',
        'usage_limit' => 'integer',
        'sort_order' => 'integer',
        'metadata' => 'array',
    ];

    /**
     * Get the categories that this AI tool belongs to.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'ai_tool_category')
                    ->withTimestamps()
                    ->withPivot('sort_order');
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
     * Scope to get only featured tools.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('name', 'asc');
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
