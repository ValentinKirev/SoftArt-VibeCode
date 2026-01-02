<?php

// Simple API router for SoftArt AI HUB
header('Content-Type: application/json');

// Enable CORS for all requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helper function to get all HTTP headers
function get_http_headers() {
    $headers = [];
    foreach ($_SERVER as $key => $value) {
        if (substr($key, 0, 5) == 'HTTP_') {
            $headerKey = str_replace(' ', '-', ucwords(strtolower(substr($key, 5))));
            $headers[$headerKey] = $value;
        }
    }
    return $headers;
}

$request_uri = $_SERVER['REQUEST_URI'] ?? '';
$request_method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Parse the URI to get the endpoint
$endpoint = str_replace('/api', '', $request_uri);
$endpoint = strtok($endpoint, '?');

// Database connection
$host = 'mysql';
$dbname = 'vibecode_db';
$username = 'vibecode_user';
$password = 'secure_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

switch ($request_method) {
    case 'POST':
        if ($endpoint === '/login') {
            // Get raw POST data for debugging
            $raw_input = file_get_contents('php://input');
            error_log("Raw input: " . $raw_input);
            
            // Try to parse as JSON first
            $input = json_decode($raw_input, true);
            
            // If JSON parsing fails, try to parse the malformed format
            if (!$input) {
                error_log("JSON parsing failed, trying fallback");
                // Handle malformed JSON like {email:ivan@admin.local,password:password}
                $raw_input = str_replace(['{', '}'], '', $raw_input);
                $raw_input = trim($raw_input);
                $pairs = explode(',', $raw_input);
                $input = [];
                foreach ($pairs as $pair) {
                    $pair = trim($pair);
                    if (strpos($pair, ':') !== false) {
                        list($key, $value) = explode(':', $pair, 2);
                        $input[trim($key)] = trim($value, '"');
                    }
                }
            }
            
            error_log("Decoded input: " . print_r($input, true));
            
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            error_log("Email: $email, Password: $password");

            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['message' => 'Email and password are required']);
                exit;
            }

            // Query user from database with role
            $stmt = $pdo->prepare("SELECT u.*, r.name as role_name, r.slug as role_slug FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $token = 'laravel-token-' . $user['id'] . '-' . time();
                
                echo json_encode([
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'role' => $user['role_slug'] ?? 'user'
                    ],
                    'token' => $token
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['message' => 'Invalid credentials']);
            }
        } elseif ($endpoint === '/logout') {
            echo json_encode(['message' => 'Logged out successfully']);
        } elseif ($endpoint === '/tools') {
            // Create new tool
            $raw_input = file_get_contents('php://input');
            
            // Debug logging
            error_log("Raw input: " . $raw_input);
            
            // Try standard JSON parsing first
            $input = json_decode($raw_input, true);
            
            // If standard parsing fails, try fixing common issues
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("Standard JSON parsing failed, attempting fixes...");
                
                // Fix common JSON issues
                $raw_input = str_replace("'", '"', $raw_input);
                $raw_input = preg_replace('/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/', '$1"$2":', $raw_input);
                $raw_input = preg_replace('/:\s*([a-zA-Z][a-zA-Z0-9_]*)([,\}])/', ':"$1"$2', $raw_input);
                
                $input = json_decode($raw_input, true);
                error_log("Fixed input: " . $raw_input);
            }
            
            // If still no input, try the simple fallback
            if (!$input) {
                error_log("JSON parsing failed, trying fallback");
                $raw_input = str_replace(['{', '}'], '', $raw_input);
                $raw_input = trim($raw_input);
                $pairs = explode(',', $raw_input);
                $input = [];
                $capturedName = '';
                $capturedDescription = '';
                
                foreach ($pairs as $pair) {
                    $pair = trim($pair);
                    if (strpos($pair, ':') !== false) {
                        list($key, $value) = explode(':', $pair, 2);
                        $cleanKey = trim($key);
                        $cleanValue = trim($value, '"');
                        $input[$cleanKey] = $cleanValue;
                        
                        error_log("Processing pair: '$cleanKey' => '$cleanValue'");
                        
                        // CAPTURE NAME AND DESCRIPTION DURING PARSING
                        if ($cleanKey === 'name' || $cleanKey === '"name"') {
                            $capturedName = $cleanValue;
                            error_log("Captured name: '$capturedName'");
                        }
                        if ($cleanKey === 'description' || $cleanKey === '"description"') {
                            $capturedDescription = $cleanValue;
                            error_log("Captured description: '$capturedDescription'");
                        }
                    }
                }
                
                error_log("After fallback parsing - Captured name: '$capturedName', Captured description: '$capturedDescription'");
            }
            
            error_log("Decoded input: " . print_r($input, true));
            
            // USE CAPTURED VALUES IF AVAILABLE
            $name = $capturedName ?? ($input['name'] ?? '');
            $description = $capturedDescription ?? ($input['description'] ?? '');
            
            error_log("Final values - Name: '$name', Description: '$description'");
            
            // VALIDATE WITH CAPTURED VALUES
            if (empty($name) || empty($description)) {
                error_log("Validation failed - Name: '$name', Description: '$description'");
                http_response_code(400);
                echo json_encode(['error' => 'Name and description are required']);
                exit;
            }
            
            // Assign remaining variables with proper defaults
            $slug = $input['slug'] ?? '';
            $long_description = $input['long_description'] ?? '';
            $url = $input['url'] ?? '';
            $api_endpoint = $input['documentation_url'] ?? '';
            $icon = $input['icon'] ?? '🤖';
            $color = $input['color'] ?? '#3B82F6';
            $version = $input['version'] ?? '1.0.0';
            $status = $input['status'] ?? 'active';
            $is_active = ($input['is_active'] ?? true) ? 1 : 0;
            $requires_auth = ($input['requires_auth'] ?? false) ? 1 : 0;
            $api_key_required = ($input['api_key_required'] ?? false) ? 1 : 0;
            $categories = $input['categories'] ?? [];
            $roles = $input['roles'] ?? [];
            $tags = $input['tags'] ?? [];
            $examples = $input['examples'] ?? [];

            error_log("Variables assigned successfully - Name: '$name', Description: '$description'");

            // Generate slug if not provided
            if (empty($slug)) {
                $slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $name));
                $slug = trim($slug, '-');
            }

            // Insert tool
            $stmt = $pdo->prepare("INSERT INTO ai_tools (name, slug, description, long_description, url, documentation_url, icon, color, version, status, is_active, requires_auth, api_key_required) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $slug, $description, $long_description, $url, $api_endpoint, $icon, $color, $version, $status, $is_active, $requires_auth, $api_key_required]);
            $tool_id = $pdo->lastInsertId();

            // Insert categories
            foreach ($categories as $category_id) {
                $stmt = $pdo->prepare("INSERT INTO ai_tool_category (ai_tool_id, category_id) VALUES (?, ?)");
                $stmt->execute([$tool_id, $category_id]);
            }

            // Insert roles
            foreach ($roles as $role_id) {
                $stmt = $pdo->prepare("INSERT INTO ai_tool_role (ai_tool_id, role_id, access_level) VALUES (?, ?, 'read')");
                $stmt->execute([$tool_id, $role_id]);
            }

            // Insert tags
            foreach ($tags as $tag_id) {
                $stmt = $pdo->prepare("INSERT INTO ai_tool_tag (ai_tool_id, tag_id) VALUES (?, ?)");
                $stmt->execute([$tool_id, $tag_id]);
            }

            echo json_encode(['message' => 'Tool created successfully', 'tool_id' => $tool_id]);
        } elseif ($endpoint === '/categories') {
            // Create new category
            $raw_input = file_get_contents('php://input');
            $input = json_decode($raw_input, true);
            
            $name = $input['name'] ?? '';
            $slug = $input['slug'] ?? '';
            $description = $input['description'] ?? '';
            $icon = $input['icon'] ?? '📁';
            $color = $input['color'] ?? '#6B7280';
            
            if (empty($name) || empty($slug)) {
                http_response_code(400);
                echo json_encode(['error' => 'Name and slug are required']);
                exit;
            }

            // Insert category
            $stmt = $pdo->prepare("INSERT INTO categories (name, slug, description, icon, color, is_active) VALUES (?, ?, ?, ?, ?, 1)");
            $stmt->execute([$name, $slug, $description, $icon, $color]);
            $category_id = $pdo->lastInsertId();

            echo json_encode(['message' => 'Category created successfully', 'category_id' => $category_id]);
        }
        break;
        
    case 'GET':
        if ($endpoint === '/user') {
            // Get token from Authorization header
            $headers = get_http_headers();
            $auth_header = $headers['Authorization'] ?? '';
            $token = str_replace('Bearer ', '', $auth_header);
            
            // Check if token is provided
            if (empty($token)) {
                http_response_code(401);
                echo json_encode(['error' => 'No token provided']);
                exit;
            }
            
            // Extract user ID from token (format: laravel-token-{id}-{timestamp})
            if (preg_match('/laravel-token-(\d+)-/', $token, $matches)) {
                $user_id = $matches[1];
                
                // Query user from database with role
                $stmt = $pdo->prepare("SELECT u.*, r.name as role_name, r.slug as role_slug FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?");
                $stmt->execute([$user_id]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($user) {
                    echo json_encode([
                        'user' => [
                            'id' => $user['id'],
                            'name' => $user['name'],
                            'email' => $user['email'],
                            'role' => $user['role_slug'] ?? 'user'
                        ]
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(['error' => 'User not found']);
                }
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid token format']);
            }
        } elseif ($endpoint === '/tools') {
            // Get all tools with categories and roles
            $stmt = $pdo->prepare("
                SELECT 
                    at.*,
                    GROUP_CONCAT(DISTINCT CONCAT(c.name, ':', c.icon, ':', c.id)) as categories,
                    GROUP_CONCAT(DISTINCT CONCAT(r.name, ':', r.id)) as roles,
                    GROUP_CONCAT(DISTINCT CONCAT(t.name, ':', t.icon, ':', t.color, ':', t.id)) as tags
                FROM ai_tools at
                LEFT JOIN ai_tool_category atc ON at.id = atc.ai_tool_id
                LEFT JOIN categories c ON atc.category_id = c.id
                LEFT JOIN ai_tool_role atr ON at.id = atr.ai_tool_id
                LEFT JOIN roles r ON atr.role_id = r.id
                LEFT JOIN ai_tool_tag att ON at.id = att.ai_tool_id
                LEFT JOIN tags t ON att.tag_id = t.id
                GROUP BY at.id
                ORDER BY at.name
            ");
            $stmt->execute();
            $tools = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Parse categories and roles
            foreach ($tools as &$tool) {
                $categories = [];
                if ($tool['categories']) {
                    $cats = explode(',', $tool['categories']);
                    foreach ($cats as $cat) {
                        list($name, $icon, $id) = explode(':', $cat);
                        $categories[] = ['id' => $id, 'name' => $name, 'icon' => $icon];
                    }
                }
                $tool['categories'] = $categories;

                $roles = [];
                if ($tool['roles']) {
                    $rols = explode(',', $tool['roles']);
                    foreach ($rols as $rol) {
                        list($name, $id) = explode(':', $rol);
                        $roles[] = ['id' => $id, 'name' => $name];
                    }
                }
                $tool['roles'] = $roles;

                $tags = [];
                if ($tool['tags']) {
                    $tgs = explode(',', $tool['tags']);
                    foreach ($tgs as $tg) {
                        list($name, $icon, $color, $id) = explode(':', $tg);
                        $tags[] = ['id' => $id, 'name' => $name, 'icon' => $icon, 'color' => $color];
                    }
                }
                $tool['tags'] = $tags;
            }

            echo json_encode($tools);
        } elseif ($endpoint === '/categories') {
            // Get all categories
            $stmt = $pdo->prepare("SELECT * FROM categories ORDER BY name");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif ($endpoint === '/roles') {
            // Get all roles
            $stmt = $pdo->prepare("SELECT * FROM roles ORDER BY name");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif ($endpoint === '/tags') {
            // Get all tags
            $stmt = $pdo->prepare("SELECT * FROM tags WHERE is_active = 1 ORDER BY name");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif ($endpoint === '/test') {
            echo json_encode(['message' => 'API is working', 'timestamp' => date('Y-m-d H:i:s')]);
        } elseif ($endpoint === '') {
            echo json_encode(['message' => 'SoftArt AI HUB API', 'version' => '1.0.0']);
        }
        break;
        
    case 'PUT':
        // Suppress all errors and warnings to prevent JSON corruption
        error_reporting(E_ALL);
        ini_set('display_errors', 0);
        ini_set('log_errors', 1);
        
        // Start output buffering to prevent any HTML/warnings from corrupting JSON
        ob_start();
        
        if (strpos($endpoint, '/tools/') === 0) {
            // Update existing tool
            $path_parts = explode('/', $endpoint);
            $tool_id = $path_parts[2] ?? null;
            
            if (!$tool_id) {
                ob_end_clean();
                http_response_code(400);
                echo json_encode(['error' => 'Tool ID required']);
                exit;
            }
            
            $raw_input = file_get_contents('php://input');
            error_log("PUT raw input: " . $raw_input);
            
            // Try different JSON parsing methods
            $input = null;
            
            // Method 1: Standard json_decode
            $input = json_decode($raw_input, true);
            error_log("Method 1 result: " . json_encode($input));
            
            // Method 2: If failed, try with stripslashes
            if ($input === null) {
                error_log("Method 1 failed, trying with stripslashes");
                $input = json_decode(stripslashes($raw_input), true);
                error_log("Method 2 result: " . json_encode($input));
            }
            
            // Method 3: If still failed, try manual parsing
            if ($input === null) {
                error_log("Method 2 failed, trying manual parsing");
                // Simple manual parsing for basic JSON
                $input = [];
                $pairs = explode(',', trim($raw_input, '{}'));
                foreach ($pairs as $pair) {
                    $key_value = explode(':', trim($pair), 2);
                    if (count($key_value) == 2) {
                        $key = trim($key_value[0], '" ');
                        $value = trim($key_value[1], '" ');
                        $input[$key] = $value;
                    }
                }
                error_log("Method 3 result: " . json_encode($input));
            }
            
            if ($input === null) {
                ob_end_clean();
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON input']);
                exit;
            }
            
            // Update tool fields
            $update_fields = [];
            $params = [];
            
            error_log("Checking input fields: " . json_encode(array_keys($input)));
            
            if (isset($input['name'])) {
                error_log("Found name field: " . $input['name']);
                $update_fields[] = 'name = ?';
                $params[] = $input['name'];
            }
            if (isset($input['description'])) {
                error_log("Found description field: " . $input['description']);
                $update_fields[] = 'description = ?';
                $params[] = $input['description'];
            }
            if (isset($input['long_description'])) {
                $update_fields[] = 'long_description = ?';
                $params[] = $input['long_description'];
            }
            if (isset($input['url'])) {
                $update_fields[] = 'url = ?';
                $params[] = $input['url'];
            }
            if (isset($input['api_endpoint'])) {
                $update_fields[] = 'documentation_url = ?';
                $params[] = $input['api_endpoint'];
            }
            if (isset($input['icon'])) {
                $update_fields[] = 'icon = ?';
                $params[] = $input['icon'];
            }
            if (isset($input['color'])) {
                $update_fields[] = 'color = ?';
                $params[] = $input['color'];
            }
            if (isset($input['version'])) {
                $update_fields[] = 'version = ?';
                $params[] = $input['version'];
            }
            if (isset($input['status'])) {
                $update_fields[] = 'status = ?';
                $params[] = $input['status'];
            }
            if (isset($input['is_featured'])) {
                // Skip is_featured - not in database
            }
            if (isset($input['is_active'])) {
                $update_fields[] = 'is_active = ?';
                $params[] = $input['is_active'];
            }
            if (isset($input['requires_auth'])) {
                $update_fields[] = 'requires_auth = ?';
                $params[] = $input['requires_auth'];
            }
            if (isset($input['api_key_required'])) {
                $update_fields[] = 'api_key_required = ?';
                $params[] = $input['api_key_required'];
            }
            // Skip sort_order - not in database
            
            if (empty($update_fields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No valid fields to update']);
                exit;
            }
            
            $params[] = $tool_id;
            $update_fields[] = 'updated_at = NOW()';
            
            $sql = "UPDATE ai_tools SET " . implode(', ', $update_fields) . " WHERE id = ?";
            error_log("PUT SQL: " . $sql);
            error_log("PUT params: " . json_encode($params));
            
            $stmt = $pdo->prepare($sql);
            try {
                $stmt->execute($params);
                error_log("PUT SQL executed successfully");
            } catch (PDOException $e) {
                error_log("PUT SQL Error: " . $e->getMessage());
                ob_end_clean();
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
                exit;
            }
            
            // Update relationships if provided
            if (isset($input['categories'])) {
                error_log("Updating categories: " . json_encode($input['categories']));
                $stmt = $pdo->prepare("DELETE FROM ai_tool_category WHERE ai_tool_id = ?");
                $stmt->execute([$tool_id]);
                
                foreach ($input['categories'] as $category_id) {
                    $stmt = $pdo->prepare("INSERT INTO ai_tool_category (ai_tool_id, category_id) VALUES (?, ?)");
                    $stmt->execute([$tool_id, $category_id]);
                }
            }
            
            if (isset($input['roles'])) {
                error_log("Updating roles: " . json_encode($input['roles']));
                $stmt = $pdo->prepare("DELETE FROM ai_tool_role WHERE ai_tool_id = ?");
                $stmt->execute([$tool_id]);
                
                foreach ($input['roles'] as $role_id) {
                    $stmt = $pdo->prepare("INSERT INTO ai_tool_role (ai_tool_id, role_id, access_level) VALUES (?, ?, 'read')");
                    $stmt->execute([$tool_id, $role_id]);
                }
            }
            
            if (isset($input['tags'])) {
                error_log("Updating tags: " . json_encode($input['tags']));
                $stmt = $pdo->prepare("DELETE FROM ai_tool_tag WHERE ai_tool_id = ?");
                $stmt->execute([$tool_id]);
                
                foreach ($input['tags'] as $tag_id) {
                    $stmt = $pdo->prepare("INSERT INTO ai_tool_tag (ai_tool_id, tag_id) VALUES (?, ?)");
                    $stmt->execute([$tool_id, $tag_id]);
                }
            }
            
            // Return updated tool
            $stmt = $pdo->prepare("SELECT * FROM ai_tools WHERE id = ?");
            $stmt->execute([$tool_id]);
            $updated_tool = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Clean output buffer and send pure JSON
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode($updated_tool);
            exit;
        }
        break;
        
    case 'PATCH':
        if ($endpoint === '/tools') {
            // Update existing tool
            $path_parts = explode('/', $endpoint);
            $tool_id = $path_parts[1] ?? null;
            
            if (!$tool_id) {
                http_response_code(400);
                echo json_encode(['error' => 'Tool ID required']);
                exit;
            }
            
            $raw_input = file_get_contents('php://input');
            $input = json_decode($raw_input, true);
            
            // Update tool fields
            $update_fields = [];
            $params = [];
            
            if (isset($input['name'])) {
                $update_fields[] = 'name = ?';
                $params[] = $input['name'];
            }
            if (isset($input['description'])) {
                $update_fields[] = 'description = ?';
                $params[] = $input['description'];
            }
            if (isset($input['long_description'])) {
                $update_fields[] = 'long_description = ?';
                $params[] = $input['long_description'];
            }
            if (isset($input['url'])) {
                $update_fields[] = 'url = ?';
                $params[] = $input['url'];
            }
            if (isset($input['api_endpoint'])) {
                $update_fields[] = 'api_endpoint = ?';
                $params[] = $input['api_endpoint'];
            }
            if (isset($input['icon'])) {
                $update_fields[] = 'icon = ?';
                $params[] = $input['icon'];
            }
            if (isset($input['color'])) {
                $update_fields[] = 'color = ?';
                $params[] = $input['color'];
            }
            if (isset($input['version'])) {
                $update_fields[] = 'version = ?';
                $params[] = $input['version'];
            }
            if (isset($input['status'])) {
                $update_fields[] = 'status = ?';
                $params[] = $input['status'];
            }
            if (isset($input['is_featured'])) {
                $update_fields[] = 'is_featured = ?';
                $params[] = $input['is_featured'];
            }
            if (isset($input['is_active'])) {
                $update_fields[] = 'is_active = ?';
                $params[] = $input['is_active'];
            }
            if (isset($input['requires_auth'])) {
                $update_fields[] = 'requires_auth = ?';
                $params[] = $input['requires_auth'];
            }
            if (isset($input['api_key_required'])) {
                $update_fields[] = 'api_key_required = ?';
                $params[] = $input['api_key_required'];
            }
            if (isset($input['documentation_url'])) {
                $update_fields[] = 'documentation_url = ?';
                $params[] = $input['documentation_url'];
            }
            
            if (empty($update_fields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No valid fields to update']);
                exit;
            }
            
            $params[] = $tool_id;
            $update_fields[] = 'updated_at = NOW()';
            
            $sql = "UPDATE ai_tools SET " . implode(', ', $update_fields);
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            // Update relationships if provided
            if (isset($input['categories'])) {
                $stmt = $pdo->prepare("DELETE FROM ai_tool_category WHERE ai_tool_id = ?");
                $stmt->execute([$tool_id]);
                
                foreach ($input['categories'] as $category_id) {
                    $stmt = $pdo->prepare("INSERT INTO ai_tool_category (ai_tool_id, category_id) VALUES (?, ?)");
                    $stmt->execute([$tool_id, $category_id]);
                }
            }
            
            if (isset($input['roles'])) {
                $stmt = $pdo->prepare("DELETE FROM ai_tool_role WHERE ai_tool_id = ?");
                $stmt->execute([$tool_id]);
                
                foreach ($input['roles'] as $role_id) {
                    $stmt = $pdo->prepare("INSERT INTO ai_tool_role (ai_tool_id, role_id, access_level) VALUES (?, ?, 'read')");
                    $stmt->execute([$tool_id, $role_id]);
                }
            }
            
            if (isset($input['tags'])) {
                $stmt = $pdo->prepare("DELETE FROM ai_tool_tag WHERE ai_tool_id = ?");
                $stmt->execute([$tool_id]);
                
                foreach ($input['tags'] as $tag_id) {
                    $stmt = $pdo->prepare("INSERT INTO ai_tool_tag (ai_tool_id, tag_id) VALUES (?, ?)");
                    $stmt->execute([$tool_id, $tag_id]);
                }
            }
            
            echo json_encode(['message' => 'Tool updated successfully']);
        }
        break;
        
    case 'DELETE':
        if (strpos($endpoint, '/tools/') === 0) {
            // Delete tool
            $path_parts = explode('/', $endpoint);
            $tool_id = $path_parts[2] ?? null; // Fixed: ID is at index 2
            
            if (!$tool_id) {
                http_response_code(400);
                echo json_encode(['error' => 'Tool ID required']);
                exit;
            }
            
            try {
                // Delete related records first (foreign key constraints)
                $stmt = $pdo->prepare("DELETE FROM ai_tool_category WHERE ai_tool_id = ?");
                $stmt->execute([$tool_id]);
                
                $stmt = $pdo->prepare("DELETE FROM ai_tool_role WHERE ai_tool_id = ?");
                $stmt->execute([$tool_id]);
                
                $stmt = $pdo->prepare("DELETE FROM ai_tool_tag WHERE ai_tool_id = ?");
                $stmt->execute([$tool_id]);
                
                // Delete the tool - cast to integer to ensure correct type
                $stmt = $pdo->prepare("DELETE FROM ai_tools WHERE id = ?");
                $stmt->execute([(int)$tool_id]);
                
                echo json_encode(['message' => 'Tool deleted successfully']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
?>



