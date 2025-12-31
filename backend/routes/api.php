<?php

use App\Http\Controllers\Api\Auth\ApiAuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Simple authentication routes that return proper JSON
Route::post('/login', function(Request $request) {
    try {
        $email = $request->input('email');
        $password = $request->input('password');

        if (!$email || !$password) {
            return response()->json([
                'message' => 'Email and password are required'
            ], 400);
        }

        // Simple hardcoded authentication for testing
        if ($email === 'ivan@admin.local' && $password === 'password') {
            $token = 'laravel-token-1-' . time();
            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => 1,
                    'name' => 'Иван Иванов',
                    'email' => 'ivan@admin.local',
                    'role' => 'owner'
                ],
                'token' => $token
            ], 200);
        } elseif ($email === 'elena@frontend.local' && $password === 'password') {
            $token = 'laravel-token-2-' . time();
            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => 2,
                    'name' => 'Елена Петрова',
                    'email' => 'elena@frontend.local',
                    'role' => 'frontend'
                ],
                'token' => $token
            ], 200);
        } elseif ($email === 'petar@backend.local' && $password === 'password') {
            $token = 'laravel-token-3-' . time();
            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => 3,
                    'name' => 'Петър Георгиев',
                    'email' => 'petar@backend.local',
                    'role' => 'backend'
                ],
                'token' => $token
            ], 200);
        } else {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Login failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::get('/user', function(Request $request) {
    // For now, return a mock user since we don't have proper token validation
    return response()->json([
        'user' => [
            'id' => 1,
            'name' => 'Иван Иванов',
            'email' => 'ivan@admin.local',
            'role' => 'owner'
        ]
    ], 200);
});

Route::post('/logout', function(Request $request) {
    return response()->json([
        'message' => 'Logged out successfully'
    ], 200);
});

// Test route
Route::get('/test', function () {
    return 'API is working';
});





