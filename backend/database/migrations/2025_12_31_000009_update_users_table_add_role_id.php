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
        Schema::table('users', function (Blueprint $table) {
            // Add new columns only if they don't exist
            if (!Schema::hasColumn('users', 'role_id')) {
                $table->foreignId('role_id')->nullable()->after('id')->constrained('roles')->onDelete('restrict');
            }
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('role_id');
            }
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('is_active');
            }
            if (!Schema::hasColumn('users', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable()->after('last_login_at');
            }
            
            // Add indexes
            $table->index(['is_active', 'role_id']);
            $table->index('last_login_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role_id')) {
                $table->dropForeign(['role_id']);
            }
            $table->dropIndex(['is_active', 'role_id']);
            $table->dropIndex('last_login_at');
            
            // Drop columns only if they exist
            if (Schema::hasColumn('users', 'role_id')) {
                $table->dropColumn('role_id');
            }
            if (Schema::hasColumn('users', 'is_active')) {
                $table->dropColumn('is_active');
            }
            if (Schema::hasColumn('users', 'last_login_at')) {
                $table->dropColumn('last_login_at');
            }
            if (Schema::hasColumn('users', 'email_verified_at')) {
                $table->dropColumn('email_verified_at');
            }
        });
    }
};
