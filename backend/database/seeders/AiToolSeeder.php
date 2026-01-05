<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AiTool;
use App\Models\Category;
use App\Models\Role;
use App\Models\Tag;

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
                'documentation_url' => 'https://platform.openai.com/docs/api-reference/chat',
                'icon' => '💬',
                'color' => '#10A37F',
                'version' => '4.0',
                'status' => 'active',
                'requires_auth' => true,
                'api_key_required' => true,
                'is_approved' => true,
                'categories' => ['text-generation'],
                'roles' => ['Owner', 'Project Manager', 'Backend Developer', 'Frontend Developer', 'Designer', 'QA Engineer'],
                'tags' => ['natural-language', 'machine-learning', 'productivity'],
            ],
            [
                'name' => 'DALL-E 3',
                'slug' => 'dalle-3',
                'description' => 'AI image generation from text descriptions',
                'long_description' => 'DALL-E 3 creates stunning, detailed images from text prompts. Perfect for creative projects, design work, and visual content creation.',
                'url' => 'https://openai.com/dall-e-3',
                'documentation_url' => 'https://platform.openai.com/docs/api-reference/images',
                'icon' => '🎨',
                'color' => '#FF6B6B',
                'version' => '3.0',
                'status' => 'active',
                'requires_auth' => true,
                'api_key_required' => true,
                'is_approved' => true,
                'categories' => ['image-generation'],
                'roles' => ['Owner', 'Project Manager', 'Backend Developer', 'Frontend Developer', 'Designer'],
                'tags' => ['computer-vision', 'creative', 'machine-learning'],
            ],
            [
                'name' => 'GitHub Copilot',
                'slug' => 'github-copilot',
                'description' => 'AI-powered code completion and assistance',
                'long_description' => 'GitHub Copilot helps developers write code faster with AI-powered suggestions. Works directly in your IDE to provide context-aware code completions.',
                'url' => 'https://github.com/features/copilot',
                'documentation_url' => 'https://docs.github.com/en/copilot',
                'icon' => '🤖',
                'color' => '#24292E',
                'version' => '1.0',
                'status' => 'active',
                'requires_auth' => true,
                'api_key_required' => false,
                'is_approved' => true,
                'categories' => ['code-generation'],
                'roles' => ['Owner', 'Project Manager', 'Backend Developer', 'Frontend Developer', 'Designer'],
                'tags' => ['code-generation', 'productivity', 'automation'],
            ],
            [
                'name' => 'Claude',
                'slug' => 'claude',
                'description' => 'Constitutional AI assistant for complex reasoning',
                'long_description' => 'Claude is an AI assistant designed for helpful, harmless, and honest interactions. Excellent for complex reasoning, analysis, and detailed explanations.',
                'url' => 'https://claude.ai',
                'documentation_url' => 'https://docs.anthropic.com/claude/reference',
                'icon' => '🧠',
                'color' => '#D97706',
                'version' => '3.5',
                'status' => 'active',
                'requires_auth' => true,
                'api_key_required' => true,
                'is_approved' => true,
                'categories' => ['text-generation'],
                'roles' => ['Owner', 'Project Manager', 'Backend Developer', 'Frontend Developer', 'Designer', 'QA Engineer'],
                'tags' => ['natural-language', 'machine-learning', 'research'],
            ],
            [
                'name' => 'Midjourney',
                'slug' => 'midjourney',
                'description' => 'AI art generation with artistic style',
                'long_description' => 'Midjourney creates beautiful, artistic images from text descriptions. Known for its unique artistic style and high-quality outputs.',
                'url' => 'https://www.midjourney.com',
                'documentation_url' => 'https://docs.midjourney.com/docs/api-reference',
                'icon' => '🖼️',
                'color' => '#8B5CF6',
                'version' => '6.0',
                'status' => 'active',
                'requires_auth' => true,
                'api_key_required' => false,
                'is_approved' => true,
                'categories' => ['image-generation'],
                'roles' => ['Owner', 'Project Manager', 'Frontend Developer', 'Designer'],
                'tags' => ['computer-vision', 'creative'],
            ],
            [
                'name' => 'Windsurf Editor',
                'slug' => 'windsurf-editor',
                'description' => 'AI-powered code editor with intelligent assistance',
                'long_description' => 'Windsurf Editor is an advanced code editor with built-in AI assistance for code generation, debugging, and optimization.',
                'url' => 'https://windsurf-editor.example.com',
                'documentation_url' => 'https://docs.windsurf-editor.example.com',
                'icon' => '🌊',
                'color' => '#0EA5E9',
                'version' => '1.0',
                'status' => 'beta',
                'requires_auth' => true,
                'api_key_required' => false,
                'is_approved' => true,
                'categories' => ['code-generation'],
                'roles' => ['Owner', 'Project Manager', 'Backend Developer', 'Frontend Developer', 'Designer'],
                'tags' => ['code-generation', 'productivity'],
            ],
            [
                'name' => 'Stable Diffusion',
                'slug' => 'stable-diffusion',
                'description' => 'Open-source image generation model',
                'long_description' => 'Stable Diffusion is a powerful open-source image generation model that can be run locally or via API for creating diverse images.',
                'url' => 'https://stability.ai',
                'documentation_url' => 'https://platform.stability.ai/docs/api-reference',
                'icon' => '🎭',
                'color' => '#F97316',
                'version' => '2.1',
                'status' => 'active',
                'requires_auth' => true,
                'api_key_required' => true,
                'is_approved' => true,
                'categories' => ['image-generation'],
                'roles' => ['Owner', 'Project Manager', 'Backend Developer'],
                'tags' => ['computer-vision', 'research'],
            ],
            [
                'name' => 'Whisper',
                'slug' => 'whisper',
                'description' => 'AI-powered speech-to-text transcription',
                'long_description' => 'Whisper is an advanced speech recognition system that can transcribe audio with high accuracy across multiple languages.',
                'url' => 'https://openai.com/research/whisper',
                'documentation_url' => 'https://platform.openai.com/docs/api-reference/audio',
                'icon' => '🎤',
                'color' => '#10B981',
                'version' => '3.0',
                'status' => 'active',
                'requires_auth' => true,
                'api_key_required' => true,
                'is_approved' => true,
                'categories' => ['audio-processing'],
                'roles' => ['Owner', 'Project Manager', 'Backend Developer', 'Frontend Developer', 'Designer'],
                'tags' => ['audio-processing', 'machine-learning'],
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
                    'documentation_url' => $toolData['documentation_url'] ?? null,
                    'icon' => $toolData['icon'],
                    'color' => $toolData['color'],
                    'version' => $toolData['version'],
                    'status' => $toolData['status'],
                    'requires_auth' => $toolData['requires_auth'],
                    'api_key_required' => $toolData['api_key_required'],
                    'is_approved' => $toolData['is_approved'],
                ]
            );

            // Attach categories
            if (isset($toolData['categories'])) {
                $categoryIds = Category::whereIn('slug', $toolData['categories'])->pluck('id');
                $tool->categories()->sync($categoryIds);
            }

            // Attach roles
            if (isset($toolData['roles'])) {
                $roleIds = Role::whereIn('name', $toolData['roles'])->pluck('id');
                $tool->roles()->sync($roleIds);
            }

            // Attach tags
            if (isset($toolData['tags'])) {
                $tagIds = Tag::whereIn('slug', $toolData['tags'])->pluck('id');
                $tool->tags()->sync($tagIds);
            }
        }

        $this->command->info('AI Tools seeded successfully!');
    }
}
