<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Text Generation',
                'slug' => 'text-generation',
                'description' => 'AI tools for generating and manipulating text content',
                'icon' => '📝',
                'color' => '#3B82F6',
                'sort_order' => 1,
            ],
            [
                'name' => 'Image Generation',
                'slug' => 'image-generation',
                'description' => 'AI tools for creating and editing images',
                'icon' => '🎨',
                'color' => '#EC4899',
                'sort_order' => 2,
            ],
            [
                'name' => 'Code Generation',
                'slug' => 'code-generation',
                'description' => 'AI tools for code generation and programming assistance',
                'icon' => '💻',
                'color' => '#10B981',
                'sort_order' => 3,
            ],
            [
                'name' => 'Data Analysis',
                'slug' => 'data-analysis',
                'description' => 'AI tools for data processing and analysis',
                'icon' => '📊',
                'color' => '#F59E0B',
                'sort_order' => 4,
            ],
            [
                'name' => 'Audio Processing',
                'slug' => 'audio-processing',
                'description' => 'AI tools for audio generation and processing',
                'icon' => '🎵',
                'color' => '#8B5CF6',
                'sort_order' => 5,
            ],
            [
                'name' => 'Video Processing',
                'slug' => 'video-processing',
                'description' => 'AI tools for video generation and editing',
                'icon' => '🎬',
                'color' => '#EF4444',
                'sort_order' => 6,
            ],
            [
                'name' => 'Translation',
                'slug' => 'translation',
                'description' => 'AI tools for language translation',
                'icon' => '🌍',
                'color' => '#06B6D4',
                'sort_order' => 7,
            ],
            [
                'name' => 'Productivity',
                'slug' => 'productivity',
                'description' => 'AI tools for productivity and automation',
                'icon' => '⚡',
                'color' => '#6366F1',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::updateOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }

        $this->command->info('Categories seeded successfully!');
    }
}
