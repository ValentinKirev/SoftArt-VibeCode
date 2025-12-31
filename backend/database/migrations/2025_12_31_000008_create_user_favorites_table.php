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
        Schema::create('user_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('ai_tool_id')->constrained()->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Prevent duplicate entries
            $table->unique(['user_id', 'ai_tool_id']);
            
            // Indexes
            $table->index(['user_id', 'sort_order']);
            $table->index(['ai_tool_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_favorites');
    }
};
