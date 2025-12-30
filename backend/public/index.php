<?php

// Simple API server for testing
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Mock users data
$users = [
    1 => ['id' => 1, 'name' => 'Иван Иванов', 'email' => 'ivan@admin.local', 'role' => 'Owner'],
    2 => ['id' => 2, 'name' => 'Елена Петрова', 'email' => 'elena@frontend.local', 'role' => 'Frontend'],
    3 => ['id' => 3, 'name' => 'Петър Георгиев', 'email' => 'petar@backend.local', 'role' => 'Backend'],
];

// Mock AI tools data
$tools = [
            [
                'id' => 1,
                'name' => 'TensorFlow',
                'description' => 'Open source machine learning framework developed by Google. Provides comprehensive ecosystem for building and deploying ML models.',
                'category' => 'Machine Learning',
                'tool_type' => 'framework',
                'url' => 'https://tensorflow.org',
                'documentation_url' => 'https://tensorflow.org/guide',
                'github_url' => 'https://github.com/tensorflow/tensorflow',
                'user_id' => 3,
                'author_name' => 'Google',
                'team' => 'AI Team',
                'tags' => ['python', 'machine-learning', 'deep-learning', 'neural-networks'],
                'use_case' => 'Building and training neural networks for image recognition and natural language processing tasks.',
                'pros' => 'Comprehensive ecosystem, great documentation, production-ready deployment options.',
                'cons' => 'Steep learning curve, complex API for beginners.',
                'rating' => 5,
                'is_active' => true,
                'created_at' => '2025-01-01T00:00:00.000000Z',
                'updated_at' => '2025-01-01T00:00:00.000000Z',
                'user' => $users[3]
            ],
            [
                'id' => 2,
                'name' => 'OpenAI API',
                'description' => 'Access to OpenAI\'s powerful language models including GPT-4, GPT-3.5, and DALL-E for text and image generation.',
                'category' => 'AI Services',
                'tool_type' => 'api',
                'url' => 'https://openai.com/api',
                'documentation_url' => 'https://platform.openai.com/docs',
                'user_id' => 1,
                'author_name' => 'OpenAI',
                'team' => 'Innovation Team',
                'tags' => ['api', 'language-models', 'text-generation', 'ai-services'],
                'use_case' => 'Integrating AI-powered text generation and conversation capabilities into our applications.',
                'pros' => 'High-quality outputs, reliable service, comprehensive documentation.',
                'cons' => 'API costs can add up, rate limits apply.',
                'rating' => 5,
                'is_active' => true,
                'created_at' => '2025-01-01T00:00:00.000000Z',
                'updated_at' => '2025-01-01T00:00:00.000000Z',
                'user' => $users[1]
            ],
            [
                'id' => 3,
                'name' => 'Figma',
                'description' => 'Collaborative interface design tool with real-time collaboration, prototyping, and design systems.',
                'category' => 'Design Tools',
                'tool_type' => 'application',
                'url' => 'https://figma.com',
                'documentation_url' => 'https://help.figma.com',
                'user_id' => 1,
                'author_name' => 'Figma',
                'team' => 'Design Team',
                'tags' => ['design', 'ui', 'ux', 'prototyping', 'collaboration'],
                'use_case' => 'Creating wireframes, prototypes, and design systems for our web and mobile applications.',
                'pros' => 'Real-time collaboration, extensive plugin ecosystem, works in browser.',
                'cons' => 'Requires internet connection, some advanced features are paid.',
                'rating' => 5,
                'is_active' => true,
                'created_at' => '2025-01-01T00:00:00.000000Z',
                'updated_at' => '2025-01-01T00:00:00.000000Z',
                'user' => $users[1]
            ],
            [
                'id' => 4,
                'name' => 'React Testing Library',
                'description' => 'Simple and complete testing utilities that encourage good testing practices for React components.',
                'category' => 'Testing',
                'tool_type' => 'library',
                'url' => 'https://testing-library.com/docs/react-testing-library/intro',
                'documentation_url' => 'https://testing-library.com/docs/react-testing-library/intro',
                'github_url' => 'https://github.com/testing-library/react-testing-library',
                'user_id' => 2,
                'author_name' => 'Kent C. Dodds',
                'team' => 'Frontend Team',
                'tags' => ['testing', 'react', 'javascript', 'frontend'],
                'use_case' => 'Writing unit and integration tests for React components to ensure code quality.',
                'pros' => 'Encourages testing user interactions, simple API, works with all React testing frameworks.',
                'cons' => 'Requires understanding of testing best practices.',
                'rating' => 4,
                'is_active' => true,
                'created_at' => '2025-01-01T00:00:00.000000Z',
                'updated_at' => '2025-01-01T00:00:00.000000Z',
                'user' => $users[2]
            ],
            [
                'id' => 5,
                'name' => 'Laravel Sanctum',
                'description' => 'Lightweight authentication system for SPAs, mobile applications, and simple APIs.',
                'category' => 'Authentication',
                'tool_type' => 'library',
                'url' => 'https://laravel.com/docs/sanctum',
                'documentation_url' => 'https://laravel.com/docs/sanctum',
                'github_url' => 'https://github.com/laravel/sanctum',
                'user_id' => 3,
                'author_name' => 'Laravel',
                'team' => 'Backend Team',
                'tags' => ['php', 'laravel', 'authentication', 'api', 'security'],
                'use_case' => 'Implementing secure API authentication for our web applications.',
                'pros' => 'Simple to use, integrates seamlessly with Laravel, supports multiple authentication methods.',
                'cons' => 'Laravel-specific, may not be suitable for non-Laravel projects.',
                'rating' => 4,
                'is_active' => true,
                'created_at' => '2025-01-01T00:00:00.000000Z',
                'updated_at' => '2025-01-01T00:00:00.000000Z',
                'user' => $users[3]
            ],
            [
                'id' => 6,
                'name' => 'Postman',
                'description' => 'API development and testing tool that helps developers build, test, and document APIs more efficiently.',
                'category' => 'API Development',
                'tool_type' => 'application',
                'url' => 'https://postman.com',
                'documentation_url' => 'https://learning.postman.com/docs/getting-started/introduction',
                'user_id' => 3,
                'author_name' => 'Postman',
                'team' => 'Backend Team',
                'tags' => ['api', 'testing', 'documentation', 'development'],
                'use_case' => 'Testing and documenting our API endpoints, automating API testing workflows.',
                'pros' => 'User-friendly interface, powerful automation features, great collaboration tools.',
                'cons' => 'Free tier has limitations, can be resource-intensive.',
                'rating' => 5,
                'is_active' => true,
                'created_at' => '2025-01-01T00:00:00.000000Z',
                'updated_at' => '2025-01-01T00:00:00.000000Z',
                'user' => $users[3]
            ],
            [
                'id' => 7,
                'name' => 'Docker',
                'description' => 'Platform for developing, shipping, and running applications in containers.',
                'category' => 'DevOps',
                'tool_type' => 'application',
                'url' => 'https://docker.com',
                'documentation_url' => 'https://docs.docker.com',
                'github_url' => 'https://github.com/docker/docker',
                'user_id' => 3,
                'author_name' => 'Docker Inc.',
                'team' => 'DevOps Team',
                'tags' => ['containers', 'devops', 'deployment', 'virtualization'],
                'use_case' => 'Containerizing our applications for consistent development and deployment environments.',
                'pros' => 'Ensures consistency across environments, easy scaling, comprehensive ecosystem.',
                'cons' => 'Learning curve, resource overhead for small projects.',
                'rating' => 5,
                'is_active' => true,
                'created_at' => '2025-01-01T00:00:00.000000Z',
                'updated_at' => '2025-01-01T00:00:00.000000Z',
                'user' => $users[3]
            ],
            [
                'id' => 8,
                'name' => 'Tailwind CSS',
                'description' => 'Utility-first CSS framework for rapidly building custom user interfaces.',
                'category' => 'Frontend Framework',
                'tool_type' => 'framework',
                'url' => 'https://tailwindcss.com',
                'documentation_url' => 'https://tailwindcss.com/docs',
                'github_url' => 'https://github.com/tailwindlabs/tailwindcss',
                'user_id' => 2,
                'author_name' => 'Tailwind Labs',
                'team' => 'Frontend Team',
                'tags' => ['css', 'frontend', 'utility-classes', 'responsive-design'],
                'use_case' => 'Rapidly building responsive, modern user interfaces with consistent styling.',
                'pros' => 'Fast development, consistent design system, responsive by default.',
                'cons' => 'Requires learning utility classes, can lead to verbose HTML.',
                'rating' => 4,
                'is_active' => true,
                'created_at' => '2025-01-01T00:00:00.000000Z',
                'updated_at' => '2025-01-01T00:00:00.000000Z',
                'user' => $users[2]
            ]
];

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

global $tools, $users;

// Users API
if (strpos($request_uri, '/api/users') === 0) {
    if ($method === 'GET') {
        echo json_encode([
            'success' => true,
            'data' => array_values($users),
            'message' => 'Users retrieved successfully'
        ]);
    }
    exit;
}

// Metadata API for filters
if (strpos($request_uri, '/api/ai-tools-meta') === 0) {
    // Use global tools array

    if (strpos($request_uri, '/api/ai-tools-meta/categories') !== false) {
        $categories = array_unique(array_column(array_filter($tools, function($tool) {
            return isset($tool['category']) && !empty($tool['category']);
        }), 'category'));
        sort($categories);
        echo json_encode([
            'success' => true,
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
        exit;
    }

    if (strpos($request_uri, '/api/ai-tools-meta/teams') !== false) {
        $teams = array_unique(array_column(array_filter($tools, function($tool) {
            return isset($tool['team']) && !empty($tool['team']);
        }), 'team'));
        sort($teams);
        echo json_encode([
            'success' => true,
            'data' => $teams,
            'message' => 'Teams retrieved successfully'
        ]);
        exit;
    }

    if (strpos($request_uri, '/api/ai-tools-meta/tags') !== false) {
        $all_tags = [];
        foreach ($tools as $tool) {
            if (isset($tool['tags']) && is_array($tool['tags'])) {
                $all_tags = array_merge($all_tags, $tool['tags']);
            }
        }
        $tags = array_unique($all_tags);
        sort($tags);
        echo json_encode([
            'success' => true,
            'data' => $tags,
            'message' => 'Tags retrieved successfully'
        ]);
        exit;
    }
}

// Basic AI tools API response with user relationships
if (strpos($request_uri, '/api/ai-tools') === 0) {
    if ($method === 'GET') {
        // Parse query parameters for filtering
        $query_params = [];
        parse_str(parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY) ?? '', $query_params);

        $search = $query_params['search'] ?? '';
        $category = $query_params['category'] ?? '';
        $type = $query_params['type'] ?? '';
        $team = $query_params['team'] ?? '';
        $per_page = (int)($query_params['per_page'] ?? 15);
        $page = (int)($query_params['page'] ?? 1);

        // Use the global tools array

        // Apply filters
        $filtered_tools = array_filter($tools, function($tool) use ($search, $category, $type, $team) {
            // Search filter (searches in name and description)
            if ($search && stripos($tool['name'], $search) === false && stripos($tool['description'], $search) === false) {
                return false;
            }

            // Category filter
            if ($category && (!isset($tool['category']) || $tool['category'] !== $category)) {
                return false;
            }

            // Type filter
            if ($type && $tool['tool_type'] !== $type) {
                return false;
            }

            // Team filter
            if ($team && (!isset($tool['team']) || $tool['team'] !== $team)) {
                return false;
            }

            return true;
        });

        // Pagination
        $total_tools = count($filtered_tools);
        $total_pages = ceil($total_tools / $per_page);
        $offset = ($page - 1) * $per_page;
        $paginated_tools = array_slice(array_values($filtered_tools), $offset, $per_page);

        // Build pagination URLs
        $base_url = 'http://localhost:8000/api/ai-tools';
        $query_string = http_build_query(array_filter([
            'search' => $search,
            'category' => $category,
            'type' => $type,
            'team' => $team,
            'per_page' => $per_page
        ]));

        $full_base_url = $base_url . ($query_string ? '?' . $query_string . '&' : '?');

        echo json_encode([
            'success' => true,
            'data' => [
                'current_page' => $page,
                'data' => $paginated_tools,
                'first_page_url' => $full_base_url . 'page=1',
                'from' => $offset + 1,
                'last_page' => $total_pages,
                'last_page_url' => $full_base_url . 'page=' . $total_pages,
                'next_page_url' => $page < $total_pages ? $full_base_url . 'page=' . ($page + 1) : null,
                'path' => $base_url,
                'per_page' => $per_page,
                'prev_page_url' => $page > 1 ? $full_base_url . 'page=' . ($page - 1) : null,
                'to' => min($offset + $per_page, $total_tools),
                'total' => $total_tools
            ],
            'message' => 'AI tools retrieved successfully'
        ]);
    } elseif ($method === 'POST') {
        // Get POST data
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? 1;

        $newTool = [
            'id' => rand(100, 999),
            'name' => $input['name'] ?? 'New Tool',
            'description' => $input['description'] ?? 'A new AI tool',
            'tool_type' => $input['tool_type'] ?? 'library',
            'category' => $input['category'] ?? null,
            'url' => $input['url'] ?? null,
            'documentation_url' => $input['documentation_url'] ?? null,
            'github_url' => $input['github_url'] ?? null,
            'user_id' => $userId,
            'author_name' => $users[$userId]['name'] ?? 'Unknown',
            'author_email' => $users[$userId]['email'] ?? null,
            'team' => $input['team'] ?? null,
            'tags' => $input['tags'] ?? [],
            'use_case' => $input['use_case'] ?? null,
            'pros' => $input['pros'] ?? null,
            'cons' => $input['cons'] ?? null,
            'rating' => $input['rating'] ?? 3,
            'is_active' => true,
            'created_at' => date('Y-m-d\TH:i:s.v\Z'),
            'updated_at' => date('Y-m-d\TH:i:s.v\Z'),
            'user' => $users[$userId] ?? null
        ];

        echo json_encode([
            'success' => true,
            'data' => $newTool,
            'message' => 'AI tool created successfully'
        ]);
    }
} else {
    echo json_encode([
        'success' => true,
        'message' => 'SoftArt VibeCode AI Tools API',
        'version' => '1.0.0',
        'endpoints' => [
            'AI Tools' => [
                'GET /api/ai-tools' => 'List all AI tools with user information',
                'POST /api/ai-tools' => 'Create new AI tool (requires user_id)',
                'GET /api/ai-tools/{id}' => 'Get specific tool',
                'PUT /api/ai-tools/{id}' => 'Update tool',
                'DELETE /api/ai-tools/{id}' => 'Delete tool'
            ],
            'Users' => [
                'GET /api/users' => 'List all users',
                'GET /api/users/{id}' => 'Get specific user'
            ]
        ],
        'user_roles' => ['Owner', 'Backend', 'Frontend', 'PM', 'QA', 'Designer']
    ]);
}
