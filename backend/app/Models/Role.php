<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'permissions',
        'is_active',
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the users that have this role.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the AI tools that this role has access to.
     */
    public function aiTools(): BelongsToMany
    {
        return $this->belongsToMany(AiTool::class, 'ai_tool_role')
                    ->withTimestamps()
                    ->withPivot(['access_level', 'custom_permissions']);
    }

    /**
     * Get the categories that this role has access to.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_role')
                    ->withTimestamps();
    }

    /**
     * Scope to get only active roles.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('name', 'asc');
    }

    /**
     * Check if role has a specific permission.
     */
    public function hasPermission($permission)
    {
        return in_array($permission, $this->permissions ?? []);
    }

    /**
     * Get default roles for the system.
     */
    public static function getDefaultRoles()
    {
        return [
            'owner' => [
                'name' => 'Owner',
                'slug' => 'owner',
                'description' => 'System owner with full access',
                'permissions' => ['*'], // All permissions
            ],
            'frontend' => [
                'name' => 'Frontend Developer',
                'slug' => 'frontend',
                'description' => 'Frontend development tools and UI components',
                'permissions' => ['view_frontend_tools', 'edit_ui_components', 'manage_assets'],
            ],
            'backend' => [
                'name' => 'Backend Developer',
                'slug' => 'backend',
                'description' => 'Backend development tools and API management',
                'permissions' => ['view_backend_tools', 'manage_apis', 'monitor_performance', 'database_access'],
            ],
            'user' => [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Basic user access',
                'permissions' => ['view_basic_tools'],
            ],
        ];
    }
}
