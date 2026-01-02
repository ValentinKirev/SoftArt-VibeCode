<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            [
                'name' => 'Machine Learning',
                'slug' => 'machine-learning',
                'description' => 'AI tools focused on machine learning algorithms and models',
                'color' => '#FF6B6B',
                'icon' => '🤖',
                'is_active' => true,
            ],
            [
                'name' => 'Natural Language',
                'slug' => 'natural-language',
                'description' => 'Tools for processing and understanding human language',
                'color' => '#4ECDC4',
                'icon' => '💬',
                'is_active' => true,
            ],
            [
                'name' => 'Computer Vision',
                'slug' => 'computer-vision',
                'description' => 'AI tools for image and video processing',
                'color' => '#45B7D1',
                'icon' => '👁️',
                'is_active' => true,
            ],
            [
                'name' => 'Code Generation',
                'slug' => 'code-generation',
                'description' => 'Tools that help write and generate code',
                'color' => '#96CEB4',
                'icon' => '💻',
                'is_active' => true,
            ],
            [
                'name' => 'Data Analysis',
                'slug' => 'data-analysis',
                'description' => 'Tools for analyzing and visualizing data',
                'color' => '#FFEAA7',
                'icon' => '📊',
                'is_active' => true,
            ],
            [
                'name' => 'Audio Processing',
                'slug' => 'audio-processing',
                'description' => 'AI tools for audio and speech processing',
                'color' => '#DDA0DD',
                'icon' => '🎵',
                'is_active' => true,
            ],
            [
                'name' => 'Productivity',
                'slug' => 'productivity',
                'description' => 'Tools that enhance productivity and workflow',
                'color' => '#98D8C8',
                'icon' => '⚡',
                'is_active' => true,
            ],
            [
                'name' => 'Creative',
                'slug' => 'creative',
                'description' => 'Tools for creative tasks and artistic work',
                'color' => '#F7DC6F',
                'icon' => '🎨',
                'is_active' => true,
            ],
            [
                'name' => 'Automation',
                'slug' => 'automation',
                'description' => 'Tools for automating repetitive tasks',
                'color' => '#BB8FCE',
                'icon' => '🔄',
                'is_active' => true,
            ],
            [
                'name' => 'Research',
                'slug' => 'research',
                'description' => 'Tools for academic and scientific research',
                'color' => '#85C1E2',
                'icon' => '🔬',
                'is_active' => true,
            ],
        ];

        foreach ($tags as $tag) {
            Tag::updateOrCreate(
                ['slug' => $tag['slug']],
                $tag
            );
        }
    }
}
