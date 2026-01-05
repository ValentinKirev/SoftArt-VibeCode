<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\API\AiToolController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Authentication API routes
Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('api.register');

Route::post('/login', [App\Http\Controllers\API\Auth\ApiAuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('api.login');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->name('api.logout');

// Protected API routes
Route::get('/user', function (Request $request) {
    // Get the authenticated user
    $user = $request->user();
    
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }
    
    // Get role name directly using role_id
    $roleName = 'Unknown';
    $roleSlug = null;
    $roleId = null;
    if ($user->role_id) {
        $role = \App\Models\Role::find($user->role_id);
        if ($role) {
            $roleName = $role->name; // Use the role name, not slug
            $roleSlug = $role->slug;
            $roleId = $role->id;
        }
    }
    
    // Debug logging - write to file
    $debugData = [
        'endpoint' => '/api/user',
        'user_id' => $user->id,
        'user_name' => $user->name,
        'role_id' => $user->role_id,
        'role_name' => $roleName,
        'role_slug' => $roleSlug,
        'role_object' => [
            'id' => $roleId,
            'name' => $roleName,
            'slug' => $roleSlug,
        ]
    ];
    
    Log::info('API User endpoint accessed', $debugData);
    
    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role_id' => $user->role_id,
        'role' => [
            'id' => $roleId,
            'name' => $roleName,
            'slug' => $roleSlug,
        ],
        'email_verified_at' => $user->email_verified_at,
        'created_at' => $user->created_at,
        'updated_at' => $user->updated_at,
        'avatar' => $user->avatar,
    ]);
});

// Avatar upload route (protected)
Route::post('/user/avatar', function (Request $request) {
    try {
        // Debug logging
        \Log::info('Avatar upload attempt', [
            'has_file' => $request->hasFile('avatar'),
            'headers' => $request->headers->all(),
            'user_authenticated' => auth()->check(),
            'user_id' => auth()->id(),
        ]);

        $user = auth()->user();
        if (!$user) {
            \Log::warning('Avatar upload: No authenticated user');
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if (!$request->hasFile('avatar')) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        $file = $request->file('avatar');
        
        // Validate file
        if (!$file->isValid()) {
            return response()->json(['error' => 'Invalid file'], 400);
        }

        // Check file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return response()->json(['error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'], 400);
        }

        // Check file size (max 5MB)
        if ($file->getSize() > 5 * 1024 * 1024) {
            return response()->json(['error' => 'File too large. Maximum size is 5MB'], 400);
        }

        // Generate unique filename
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        
        // Store file in avatars directory
        $path = $file->storeAs('avatars', $filename, 'public');
        
        if (!$path) {
            return response()->json(['error' => 'Failed to save file'], 500);
        }

        // Update user avatar
        $user->avatar = $filename;
        $user->save();

        \Log::info('Avatar upload successful', [
            'user_id' => $user->id,
            'filename' => $filename,
        ]);

        return response()->json([
            'success' => true,
            'avatar' => $filename,
            'avatar_url' => asset('storage/avatars/' . $filename)
        ]);

    } catch (\Exception $e) {
        \Log::error('Avatar upload error: ' . $e->getMessage(), [
            'exception' => $e->getTraceAsString(),
        ]);
        return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
    }
})->middleware('auth:sanctum');

// Simple test route (no auth)
Route::get('/test-avatar', function () {
    return response()->json(['message' => 'Avatar test route working']);
});

// Avatar upload test route (no auth) - for debugging
Route::post('/test-avatar-upload', function (Request $request) {
    \Log::info('Test avatar upload reached', [
        'has_file' => $request->hasFile('avatar'),
        'headers' => $request->headers->all(),
        'all_data' => $request->all(),
    ]);
    
    return response()->json([
        'message' => 'Test upload received',
        'has_file' => $request->hasFile('avatar'),
        'file_info' => $request->hasFile('avatar') ? [
            'name' => $request->file('avatar')->getClientOriginalName(),
            'size' => $request->file('avatar')->getSize(),
            'mime' => $request->file('avatar')->getMimeType(),
        ] : null,
    ]);
});

// Categories CRUD routes
Route::get('/categories', function () {
    try {
        $categories = \App\Models\Category::all();
        return response()->json($categories);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch categories: ' . $e->getMessage()], 500);
    }
});

Route::post('/categories', function (Request $request) {
    try {
        $categoryData = $request->all();
        $category = \App\Models\Category::create([
            'name' => $categoryData['name'],
            'slug' => $categoryData['slug'],
            'description' => $categoryData['description'] ?? null,
            'icon' => $categoryData['icon'] ?? '📁',
            'color' => $categoryData['color'] ?? '#6B7280',
            'is_active' => $categoryData['is_active'] ?? true,
            'sort_order' => $categoryData['sort_order'] ?? 0,
        ]);
        return response()->json($category, 201);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to create category: ' . $e->getMessage()], 500);
    }
});

// Roles CRUD routes
Route::get('/roles', function () {
    try {
        $roles = \App\Models\Role::all();
        return response()->json($roles);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch roles: ' . $e->getMessage()], 500);
    }
});

// Tags CRUD routes
Route::get('/tags', function () {
    try {
        $tags = \App\Models\Tag::all();
        return response()->json($tags);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch tags: ' . $e->getMessage()], 500);
    }
});

// Tools CRUD routes with validation
Route::get('/tools', [AiToolController::class, 'index']);

Route::options('/tools', function () {
    $response = response()->json(['message' => 'CORS preflight OK']);
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    return $response;
});

Route::post('/tools', [AiToolController::class, 'store']);

Route::get('/tools/{id}', [AiToolController::class, 'show']);

Route::put('/tools/{id}', [AiToolController::class, 'update']);

Route::delete('/tools/{id}', [AiToolController::class, 'destroy']);

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working', 'timestamp' => now()]);
});

// CORS test route
Route::options('/cors-test', function () {
    return response()->json(['message' => 'CORS preflight OK']);
});

Route::post('/cors-test', function (Request $request) {
    return response()->json(['message' => 'CORS POST OK', 'data' => $request->all()]);
});
