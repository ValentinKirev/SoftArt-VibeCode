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
        Schema::create('ai_tool_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_tool_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Prevent duplicate entries
            $table->unique(['ai_tool_id', 'category_id']);
            
            // Indexes
            $table->index(['category_id', 'sort_order']);
            $table->index(['ai_tool_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tool_category');
    }
};
