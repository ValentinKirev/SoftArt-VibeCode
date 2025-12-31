<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AiTool;
use App\Models\Category;
use App\Models\Role;

class AiToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aiTools = [
            [
                'name' => 'ChatGPT',
                'slug' => 'chatgpt',
                'description' => 'Advanced conversational AI for text generation and assistance',
                'long_description' => 'ChatGPT is a powerful language model capable of understanding and generating human-like text. Perfect for writing, analysis, coding help, and creative tasks.',
                'url' => 'https://chat.openai.com',
                'api_endpoint' => 'https://api.openai.com/v1/chat/completions',
                'icon' => '💬',
                'color' => '#10A37F',
                'version' => '4.0',
                'status' => 'active',
                'is_featured' => true,
                'requires_auth' => true,
                'api_key_required' => true,
                'categories' => ['text-generation'],
                'roles' => ['owner', 'pm', 'backend', 'frontend', 'designer', 'qa', 'user'],
                'sort_order' => 1,
            ],
            [
                'name' => 'DALL-E 3',
                'slug' => 'dalle-3',
                'description' => 'AI image generation from text descriptions',
                'long_description' => 'DALL-E 3 creates stunning, detailed images from text prompts. Perfect for creative projects, design work, and visual content creation.',
                'url' => 'https://openai.com/dall-e-3',
                'api_endpoint' => 'https://api.openai.com/v1/images/generations',
                'icon' => '🎨',
                'color' => '#FF6B6B',
                'version' => '3.0',
                'status' => 'active',
                'is_featured' => true,
                'requires_auth' => true,
                'api_key_required' => true,
                'categories' => ['image-generation'],
                'roles' => ['owner', 'pm', 'backend', 'frontend', 'designer'],
                'sort_order' => 2,
            ],
            [
                'name' => 'GitHub Copilot',
                'slug' => 'github-copilot',
                'description' => 'AI-powered code completion and assistance',
                'long_description' => 'GitHub Copilot helps developers write code faster with AI-powered suggestions. Works directly in your IDE to provide context-aware code completions.',
                'url' => 'https://github.com/features/copilot',
                'icon' => '🤖',
                'color' => '#24292E',
                'version' => '1.0',
                'status' => 'active',
                'is_featured' => true,
                'requires_auth' => true,
                'api_key_required' => false,
                'categories' => ['code-generation'],
                'roles' => ['owner', 'pm', 'backend', 'frontend', 'designer'],
                'sort_order' => 3,
            ],
            [
                'name' => 'Claude',
                'slug' => 'claude',
                'description' => 'Constitutional AI assistant for complex reasoning',
                'long_description' => 'Claude is an AI assistant designed for helpful, harmless, and honest interactions. Excellent for complex reasoning, analysis, and detailed explanations.',
                'url' => 'https://claude.ai',
                'api_endpoint' => 'https://api.anthropic.com/v1/messages',
                'icon' => '🧠',
                'color' => '#D97706',
                'version' => '3.5',
                'status' => 'active',
                'is_featured' => true,
                'requires_auth' => true,
                'api_key_required' => true,
                'categories' => ['text-generation'],
                'roles' => ['owner', 'pm', 'backend', 'frontend', 'designer', 'qa', 'user'],
                'sort_order' => 4,
            ],
            [
                'name' => 'Midjourney',
                'slug' => 'midjourney',
                'description' => 'AI art generation with artistic style',
                'long_description' => 'Midjourney creates beautiful, artistic images from text descriptions. Known for its unique artistic style and high-quality outputs.',
                'url' => 'https://www.midjourney.com',
                'icon' => '🖼️',
                'color' => '#8B5CF6',
                'version' => '6.0',
                'status' => 'active',
                'is_featured' => true,
                'requires_auth' => true,
                'api_key_required' => false,
                'categories' => ['image-generation'],
                'roles' => ['owner', 'pm', 'frontend', 'designer'],
                'sort_order' => 5,
            ],
            [
                'name' => 'Windsurf Editor',
                'slug' => 'windsurf-editor',
                'description' => 'AI-powered code editor with intelligent assistance',
                'long_description' => 'Windsurf Editor is an advanced code editor with built-in AI assistance for code generation, debugging, and optimization.',
                'url' => 'https://windsurf-editor.example.com',
                'icon' => '🌊',
                'color' => '#0EA5E9',
                'version' => '1.0',
                'status' => 'beta',
                'is_featured' => false,
                'requires_auth' => true,
                'api_key_required' => false,
                'categories' => ['code-generation'],
                'roles' => ['owner', 'pm', 'backend', 'frontend', 'designer'],
                'sort_order' => 6,
            ],
            [
                'name' => 'Stable Diffusion',
                'slug' => 'stable-diffusion',
                'description' => 'Open-source image generation model',
                'long_description' => 'Stable Diffusion is a powerful open-source image generation model that can be run locally or via API for creating diverse images.',
                'url' => 'https://stability.ai',
                'api_endpoint' => 'https://api.stability.ai/v1/generation',
                'icon' => '🎭',
                'color' => '#F97316',
                'version' => '2.1',
                'status' => 'active',
                'is_featured' => false,
                'requires_auth' => true,
                'api_key_required' => true,
                'categories' => ['image-generation'],
                'roles' => ['owner', 'pm', 'backend'],
                'sort_order' => 7,
            ],
            [
                'name' => 'Whisper',
                'slug' => 'whisper',
                'description' => 'AI-powered speech-to-text transcription',
                'long_description' => 'Whisper is an advanced speech recognition system that can transcribe audio with high accuracy across multiple languages.',
                'url' => 'https://openai.com/research/whisper',
                'api_endpoint' => 'https://api.openai.com/v1/audio/transcriptions',
                'icon' => '🎤',
                'color' => '#10B981',
                'version' => '3.0',
                'status' => 'active',
                'is_featured' => false,
                'requires_auth' => true,
                'api_key_required' => true,
                'categories' => ['audio-processing'],
                'roles' => ['owner', 'pm', 'backend', 'frontend', 'designer'],
                'sort_order' => 8,
            ],
        ];

        foreach ($aiTools as $toolData) {
            $tool = AiTool::updateOrCreate(
                ['slug' => $toolData['slug']],
                [
                    'name' => $toolData['name'],
                    'description' => $toolData['description'],
                    'long_description' => $toolData['long_description'],
                    'url' => $toolData['url'],
                    'api_endpoint' => $toolData['api_endpoint'] ?? null,
                    'icon' => $toolData['icon'],
                    'color' => $toolData['color'],
                    'version' => $toolData['version'],
                    'status' => $toolData['status'],
                    'is_featured' => $toolData['is_featured'],
                    'requires_auth' => $toolData['requires_auth'],
                    'api_key_required' => $toolData['api_key_required'],
                    'sort_order' => $toolData['sort_order'],
                ]
            );

            // Attach categories
            if (isset($toolData['categories'])) {
                $categoryIds = Category::whereIn('slug', $toolData['categories'])->pluck('id');
                $tool->categories()->sync($categoryIds);
            }

            // Attach roles
            if (isset($toolData['roles'])) {
                $roleIds = Role::whereIn('slug', $toolData['roles'])->pluck('id');
                $tool->roles()->sync($roleIds);
            }
        }

        $this->command->info('AI Tools seeded successfully!');
    }
}
