<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiToolUsage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ai_tool_id',
        'usage_count',
        'last_used_at',
        'metadata',
    ];

    protected $casts = [
        'usage_count' => 'integer',
        'last_used_at' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Get the user that used this AI tool.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the AI tool that was used.
     */
    public function aiTool(): BelongsTo
    {
        return $this->belongsTo(AiTool::class);
    }

    /**
     * Scope to get usage by user.
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to get most used tools.
     */
    public function scopeMostUsed($query, $limit = 10)
    {
        return $query->orderBy('usage_count', 'desc')
                    ->orderBy('last_used_at', 'desc')
                    ->limit($limit);
    }

    /**
     * Scope to get recently used tools.
     */
    public function scopeRecentlyUsed($query, $limit = 10)
    {
        return $query->orderBy('last_used_at', 'desc')
                    ->limit($limit);
    }
}
