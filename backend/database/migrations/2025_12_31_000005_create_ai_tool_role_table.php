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
        Schema::create('ai_tool_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_tool_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->enum('access_level', ['read', 'write', 'admin'])->default('read');
            $table->json('custom_permissions')->nullable();
            $table->timestamps();

            // Prevent duplicate entries
            $table->unique(['ai_tool_id', 'role_id']);
            
            // Indexes
            $table->index(['role_id', 'access_level']);
            $table->index(['ai_tool_id', 'access_level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tool_role');
    }
};
