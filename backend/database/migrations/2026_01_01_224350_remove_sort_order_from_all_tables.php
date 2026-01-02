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
        // Remove sort_order from roles table
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        // Remove sort_order from categories table
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        // Remove sort_order from tags table
        Schema::table('tags', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        // Remove sort_order from user_favorites table
        Schema::table('user_favorites', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        // Remove sort_order from ai_tool_category pivot table
        Schema::table('ai_tool_category', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });

        // Remove sort_order from ai_tool_tag pivot table
        Schema::table('ai_tool_tag', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add sort_order back to roles table
        Schema::table('roles', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('is_active');
        });

        // Add sort_order back to categories table
        Schema::table('categories', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('is_active');
        });

        // Add sort_order back to tags table
        Schema::table('tags', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('is_active');
        });

        // Add sort_order back to user_favorites table
        Schema::table('user_favorites', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('ai_tool_id');
        });

        // Add sort_order back to ai_tool_category pivot table
        Schema::table('ai_tool_category', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('category_id');
        });

        // Add sort_order back to ai_tool_tag pivot table
        Schema::table('ai_tool_tag', function (Blueprint $table) {
            $table->integer('sort_order')->default(0)->after('tag_id');
        });
    }
};
