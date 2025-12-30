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
        Schema::create('ai_tools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('category')->nullable(); // ML, NLP, Computer Vision, etc.
            $table->string('tool_type')->default('library'); // library, application, framework, api
            $table->string('url')->nullable();
            $table->string('documentation_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('author_name');
            $table->string('author_email')->nullable();
            $table->string('team')->nullable(); // which team discovered/shared it
            $table->json('tags')->nullable(); // array of tags like ['python', 'tensorflow', 'nlp']
            $table->text('use_case')->nullable();
            $table->text('pros')->nullable();
            $table->text('cons')->nullable();
            $table->integer('rating')->default(0); // 1-5 scale
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_tools');
    }
};
