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
        Schema::create('ai_tool_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_tool_id')->constrained('ai_tools')->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Unique constraint to prevent duplicate relationships
            $table->unique(['ai_tool_id', 'tag_id']);

            // Indexes
            $table->index(['ai_tool_id', 'sort_order']);
            $table->index(['tag_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tool_tag');
    }
};
