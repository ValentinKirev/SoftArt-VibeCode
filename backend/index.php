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
            $input = json_decode(file_get_contents('php://input'), true);
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['message' => 'Email and password are required']);
                exit;
            }

            // Query user from database
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
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
                        'role' => $user['role'] ?? 'user'
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
            // For now, return a mock user since we don't have proper token validation
            echo json_encode([
                'user' => [
                    'id' => 1,
                    'name' => 'Иван Иванов',
                    'email' => 'ivan@admin.local',
                    'role' => 'owner'
                ]
            ]);
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
