<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_tool_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('ai_tool_id')->constrained()->onDelete('cascade');
            $table->integer('usage_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            // Prevent duplicate entries
            $table->unique(['user_id', 'ai_tool_id']);
            
            // Indexes
            $table->index(['user_id', 'last_used_at']);
            $table->index(['ai_tool_id', 'usage_count']);
            $table->index('last_used_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tool_usages');
    }
};
