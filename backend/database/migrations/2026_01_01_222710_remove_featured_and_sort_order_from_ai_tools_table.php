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
            $table->renameColumn('api_endpoint', 'documentation_url');
            $table->dropColumn('is_featured');
            $table->dropColumn('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->renameColumn('documentation_url', 'api_endpoint');
            $table->boolean('is_featured')->default(false)->after('status');
            $table->integer('sort_order')->default(0)->after('usage_limit');
        });
    }
};
