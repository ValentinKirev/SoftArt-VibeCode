<?php

// Simple API router for SoftArt AI HUB
header('Content-Type: application/json');

// Enable CORS for all requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helper function to get all HTTP headers
function get_http_headers() {
    $headers = [];
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) == 'HTTP_') {
            $key = str_replace(' ', '-', ucwords(strtolower(substr($name, 5))));
            $headers[$key] = $value;
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
                // Handle malformed JSON like {email:ivan@admin.local,password:password}
                $raw_input = str_replace(['{', '}'], '', $raw_input);
                $pairs = explode(',', $raw_input);
                $input = [];
                foreach ($pairs as $pair) {
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
        }
        break;
        
    case 'GET':
        if ($endpoint === '/user') {
            // Get token from Authorization header
            $headers = get_http_headers();
            $auth_header = $headers['Authorization'] ?? '';
            $token = str_replace('Bearer ', '', $auth_header);
            
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
        } elseif ($endpoint === '/test') {
            echo json_encode(['message' => 'API is working', 'database' => 'connected']);
        } elseif ($endpoint === '') {
            echo json_encode(['message' => 'SoftArt AI HUB API', 'version' => '1.0.0']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
?>

