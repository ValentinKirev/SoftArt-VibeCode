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
        Schema::table('ai_tools', function (Blueprint $table) {
            // Add new columns if they don't exist
            if (!Schema::hasColumn('ai_tools', 'slug')) {
                $table->string('slug')->unique()->after('name');
            }
            if (!Schema::hasColumn('ai_tools', 'long_description')) {
                $table->text('long_description')->nullable()->after('description');
            }
            if (!Schema::hasColumn('ai_tools', 'url')) {
                $table->string('url')->nullable()->after('long_description');
            }
            if (!Schema::hasColumn('ai_tools', 'api_endpoint')) {
                $table->string('api_endpoint')->nullable()->after('url');
            }
            if (!Schema::hasColumn('ai_tools', 'icon')) {
                $table->string('icon')->nullable()->after('api_endpoint');
            }
            if (!Schema::hasColumn('ai_tools', 'color')) {
                $table->string('color')->nullable()->after('icon');
            }
            if (!Schema::hasColumn('ai_tools', 'version')) {
                $table->string('version')->default('1.0.0')->after('color');
            }
            if (!Schema::hasColumn('ai_tools', 'status')) {
                $table->enum('status', ['active', 'inactive', 'maintenance', 'beta'])->default('active')->after('version');
            }
            if (!Schema::hasColumn('ai_tools', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('status');
            }
            if (!Schema::hasColumn('ai_tools', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('is_featured');
            }
            if (!Schema::hasColumn('ai_tools', 'requires_auth')) {
                $table->boolean('requires_auth')->default(false)->after('is_active');
            }
            if (!Schema::hasColumn('ai_tools', 'api_key_required')) {
                $table->boolean('api_key_required')->default(false)->after('requires_auth');
            }
            if (!Schema::hasColumn('ai_tools', 'usage_limit')) {
                $table->integer('usage_limit')->nullable()->after('api_key_required');
            }
            if (!Schema::hasColumn('ai_tools', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('usage_limit');
            }
            if (!Schema::hasColumn('ai_tools', 'metadata')) {
                $table->json('metadata')->nullable()->after('sort_order');
            }

            // Drop old category column if it exists (we'll use pivot table instead)
            if (Schema::hasColumn('ai_tools', 'category')) {
                $table->dropColumn('category');
            }

            // Add indexes
            $table->index(['is_active', 'is_featured', 'sort_order']);
            $table->index('status');
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_tools', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex(['is_active', 'is_featured', 'sort_order']);
            $table->dropIndex('status');
            $table->dropIndex('slug');

            // Drop columns (only if they exist)
            $columnsToDrop = [
                'slug',
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
                'metadata'
            ];

            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('ai_tools', $column)) {
                    $table->dropColumn($column);
                }
            }

            // Add back the old category column if it was dropped
            if (!Schema::hasColumn('ai_tools', 'category')) {
                $table->string('category')->nullable()->after('description');
            }
        });
    }
};
