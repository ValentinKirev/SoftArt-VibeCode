<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_active',
        'last_login_at',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    /**
     * Get the role that belongs to the user.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the AI tools that this user has access to through their role.
     */
    public function accessibleAiTools(): BelongsToMany
    {
        return $this->role()->first()->aiTools();
    }

    /**
     * Get the AI tool usage logs for this user.
     */
    public function aiToolUsages(): HasMany
    {
        return $this->hasMany(AiToolUsage::class);
    }

    /**
     * Get the favorite AI tools for this user.
     */
    public function favoriteAiTools(): HasMany
    {
        return $this->hasMany(UserFavorite::class);
    }

    /**
     * Get the AI tools that this user has favorited.
     */
    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(AiTool::class, 'user_favorites')
                    ->withPivot('sort_order')
                    ->withTimestamps()
                    ->orderBy('sort_order');
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission($permission)
    {
        return $this->role && $this->role->hasPermission($permission);
    }

    /**
     * Check if user can access a specific AI tool.
     */
    public function canAccessAiTool($aiToolId)
    {
        return $this->accessibleAiTools()->where('ai_tools.id', $aiToolId)->exists();
    }

    /**
     * Scope to get only active users.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the user's role name.
     */
    public function getRoleNameAttribute()
    {
        return $this->role ? $this->role->name : 'Unknown';
    }

    /**
     * Update last login timestamp.
     */
    public function updateLastLogin()
    {
        $this->update(['last_login_at' => now()]);
    }
}




