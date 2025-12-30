<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AiTool;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create sample users
        $users = [
            [
                'name' => 'Иван Иванов',
                'email' => 'ivan@admin.local',
                'password' => Hash::make('password'),
                'role' => 'Owner',
                'is_active' => true,
            ],
            [
                'name' => 'Елена Петрова',
                'email' => 'elena@frontend.local',
                'password' => Hash::make('password'),
                'role' => 'Frontend',
                'is_active' => true,
            ],
            [
                'name' => 'Петър Георгиев',
                'email' => 'petar@backend.local',
                'password' => Hash::make('password'),
                'role' => 'Backend',
                'is_active' => true,
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        // Create sample AI tools
        $aiTools = [
            [
                'name' => 'TensorFlow',
                'description' => 'Open source machine learning framework developed by Google. Provides comprehensive ecosystem for building and deploying ML models.',
                'category' => 'Machine Learning',
                'tool_type' => 'framework',
                'url' => 'https://tensorflow.org',
                'documentation_url' => 'https://tensorflow.org/guide',
                'github_url' => 'https://github.com/tensorflow/tensorflow',
                'user_id' => 3, // Петър Георгиев (Backend)
                'author_name' => 'Google',
                'team' => 'AI Team',
                'tags' => ['python', 'machine-learning', 'deep-learning', 'neural-networks'],
                'use_case' => 'Building and training neural networks for image recognition and natural language processing tasks.',
                'pros' => 'Comprehensive ecosystem, great documentation, production-ready deployment options.',
                'cons' => 'Steep learning curve, complex API for beginners.',
                'rating' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'OpenAI API',
                'description' => 'Access to OpenAI\'s powerful language models including GPT-4, GPT-3.5, and DALL-E for text and image generation.',
                'category' => 'AI Services',
                'tool_type' => 'api',
                'url' => 'https://openai.com/api',
                'documentation_url' => 'https://platform.openai.com/docs',
                'user_id' => 1, // Иван Иванов (Owner)
                'author_name' => 'OpenAI',
                'team' => 'Innovation Team',
                'tags' => ['api', 'language-models', 'text-generation', 'ai-services'],
                'use_case' => 'Integrating AI-powered text generation and conversation capabilities into our applications.',
                'pros' => 'High-quality outputs, reliable service, comprehensive documentation.',
                'cons' => 'API costs can add up, rate limits apply.',
                'rating' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Figma',
                'description' => 'Collaborative interface design tool with real-time collaboration, prototyping, and design systems.',
                'category' => 'Design Tools',
                'tool_type' => 'application',
                'url' => 'https://figma.com',
                'documentation_url' => 'https://help.figma.com',
                'user_id' => 1, // Иван Иванов (Owner)
                'author_name' => 'Figma',
                'team' => 'Design Team',
                'tags' => ['design', 'ui', 'ux', 'prototyping', 'collaboration'],
                'use_case' => 'Creating wireframes, prototypes, and design systems for our web and mobile applications.',
                'pros' => 'Real-time collaboration, extensive plugin ecosystem, works in browser.',
                'cons' => 'Requires internet connection, some advanced features are paid.',
                'rating' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'React Testing Library',
                'description' => 'Simple and complete testing utilities that encourage good testing practices for React components.',
                'category' => 'Testing',
                'tool_type' => 'library',
                'url' => 'https://testing-library.com/docs/react-testing-library/intro',
                'documentation_url' => 'https://testing-library.com/docs/react-testing-library/intro',
                'github_url' => 'https://github.com/testing-library/react-testing-library',
                'user_id' => 2, // Елена Петрова (Frontend)
                'author_name' => 'Kent C. Dodds',
                'team' => 'Frontend Team',
                'tags' => ['testing', 'react', 'javascript', 'frontend'],
                'use_case' => 'Writing unit and integration tests for React components to ensure code quality.',
                'pros' => 'Encourages testing user interactions, simple API, works with all React testing frameworks.',
                'cons' => 'Requires understanding of testing best practices.',
                'rating' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Laravel Sanctum',
                'description' => 'Lightweight authentication system for SPAs, mobile applications, and simple APIs.',
                'category' => 'Authentication',
                'tool_type' => 'library',
                'url' => 'https://laravel.com/docs/sanctum',
                'documentation_url' => 'https://laravel.com/docs/sanctum',
                'github_url' => 'https://github.com/laravel/sanctum',
                'user_id' => 3, // Петър Георгиев (Backend)
                'author_name' => 'Laravel',
                'team' => 'Backend Team',
                'tags' => ['php', 'laravel', 'authentication', 'api', 'security'],
                'use_case' => 'Implementing secure API authentication for our web applications.',
                'pros' => 'Simple to use, integrates seamlessly with Laravel, supports multiple authentication methods.',
                'cons' => 'Laravel-specific, may not be suitable for non-Laravel projects.',
                'rating' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Postman',
                'description' => 'API development and testing tool that helps developers build, test, and document APIs more efficiently.',
                'category' => 'API Development',
                'tool_type' => 'application',
                'url' => 'https://postman.com',
                'documentation_url' => 'https://learning.postman.com/docs/getting-started/introduction',
                'user_id' => 3, // Петър Георгиев (Backend)
                'author_name' => 'Postman',
                'team' => 'Backend Team',
                'tags' => ['api', 'testing', 'documentation', 'development'],
                'use_case' => 'Testing and documenting our API endpoints, automating API testing workflows.',
                'pros' => 'User-friendly interface, powerful automation features, great collaboration tools.',
                'cons' => 'Free tier has limitations, can be resource-intensive.',
                'rating' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Docker',
                'description' => 'Platform for developing, shipping, and running applications in containers.',
                'category' => 'DevOps',
                'tool_type' => 'application',
                'url' => 'https://docker.com',
                'documentation_url' => 'https://docs.docker.com',
                'github_url' => 'https://github.com/docker/docker',
                'user_id' => 3, // Петър Георгиев (Backend)
                'author_name' => 'Docker Inc.',
                'team' => 'DevOps Team',
                'tags' => ['containers', 'devops', 'deployment', 'virtualization'],
                'use_case' => 'Containerizing our applications for consistent development and deployment environments.',
                'pros' => 'Ensures consistency across environments, easy scaling, comprehensive ecosystem.',
                'cons' => 'Learning curve, resource overhead for small projects.',
                'rating' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Tailwind CSS',
                'description' => 'Utility-first CSS framework for rapidly building custom user interfaces.',
                'category' => 'Frontend Framework',
                'tool_type' => 'framework',
                'url' => 'https://tailwindcss.com',
                'documentation_url' => 'https://tailwindcss.com/docs',
                'github_url' => 'https://github.com/tailwindlabs/tailwindcss',
                'user_id' => 2, // Елена Петрова (Frontend)
                'author_name' => 'Tailwind Labs',
                'team' => 'Frontend Team',
                'tags' => ['css', 'frontend', 'utility-classes', 'responsive-design'],
                'use_case' => 'Rapidly building responsive, modern user interfaces with consistent styling.',
                'pros' => 'Fast development, consistent design system, responsive by default.',
                'cons' => 'Requires learning utility classes, can lead to verbose HTML.',
                'rating' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($aiTools as $toolData) {
            AiTool::create($toolData);
        }
    }
}
