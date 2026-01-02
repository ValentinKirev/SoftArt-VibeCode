<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
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
        'raw_role_object' => $user->role_id ? \App\Models\Role::find($user->role_id) : null,
    ];
    Log::info('API User Debug', $debugData);
    file_put_contents('/tmp/debug.log', json_encode($debugData) . PHP_EOL, FILE_APPEND);
    
    return response()->json([
        'user' => [
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
        ]
    ], 200);
})->middleware('auth:sanctum');

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

// Tools CRUD routes (keep existing)
Route::get('/tools', function () {
    try {
        $tools = \App\Models\AiTool::with(['categories', 'roles', 'tags'])->get();
        return response()->json($tools);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch tools: ' . $e->getMessage()], 500);
    }
});

Route::options('/tools', function () {
    $response = response()->json(['message' => 'CORS preflight OK']);
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    return $response;
});

Route::post('/tools', function (Request $request) {
    try {
        $toolData = $request->all();
        
        // Debug logging
        error_log('Tools POST - Received data: ' . json_encode($toolData));
        error_log('Tools POST - Headers: ' . json_encode($request->headers->all()));
        
        $tool = \App\Models\AiTool::create([
            'name' => $toolData['name'],
            'description' => $toolData['description'],
            'long_description' => $toolData['long_description'] ?? null,
            'url' => $toolData['url'] ?? null,
            'api_endpoint' => $toolData['api_endpoint'] ?? null,
            'icon' => $toolData['icon'] ?? '🤖',
            'color' => $toolData['color'] ?? '#3B82F6',
            'version' => $toolData['version'] ?? '1.0.0',
            'status' => $toolData['status'] ?? 'active',
            'is_featured' => $toolData['is_featured'] ?? false,
            'is_active' => $toolData['is_active'] ?? true,
            'requires_auth' => $toolData['requires_auth'] ?? false,
            'api_key_required' => $toolData['api_key_required'] ?? false,
            'sort_order' => $toolData['sort_order'] ?? 0,
        ]);

        // Handle relationships
        if (isset($toolData['categories']) && is_array($toolData['categories'])) {
            $tool->categories()->attach($toolData['categories']);
        }
        if (isset($toolData['roles']) && is_array($toolData['roles'])) {
            $tool->roles()->attach($toolData['roles']);
        }
        if (isset($toolData['tags']) && is_array($toolData['tags'])) {
            $tool->tags()->attach($toolData['tags']);
        }

        $response = response()->json($tool, 201);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
        return $response;
    } catch (\Exception $e) {
        $response = response()->json(['error' => 'Failed to create tool: ' . $e->getMessage()], 500);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
        return $response;
    }
});

Route::put('/tools/{id}', function ($id, Request $request) {
    // Debug logging
    error_log('PUT /tools/' . $id . ' called');
    error_log('Request data: ' . json_encode($request->all()));
    
    try {
        $tool = \App\Models\AiTool::findOrFail($id);
        $toolData = $request->all();
        
        $tool->update([
            'name' => $toolData['name'],
            'description' => $toolData['description'],
            'long_description' => $toolData['long_description'] ?? $tool->long_description,
            'url' => $toolData['url'] ?? $tool->url,
            'api_endpoint' => $toolData['api_endpoint'] ?? $tool->api_endpoint,
            'icon' => $toolData['icon'] ?? $tool->icon,
            'color' => $toolData['color'] ?? $tool->color,
            'version' => $toolData['version'] ?? $tool->version,
            'status' => $toolData['status'] ?? $tool->status,
            'is_featured' => $toolData['is_featured'] ?? $tool->is_featured,
            'is_active' => $toolData['is_active'] ?? $tool->is_active,
            'requires_auth' => $toolData['requires_auth'] ?? $tool->requires_auth,
            'api_key_required' => $toolData['api_key_required'] ?? $tool->api_key_required,
            'sort_order' => $toolData['sort_order'] ?? $tool->sort_order,
        ]);

        // Update relationships - handle both formats
        if (isset($toolData['categories']) && is_array($toolData['categories'])) {
            $tool->categories()->sync($toolData['categories']);
        } elseif (isset($toolData['category_ids']) && is_array($toolData['category_ids'])) {
            $tool->categories()->sync($toolData['category_ids']);
        }
        if (isset($toolData['roles']) && is_array($toolData['roles'])) {
            $tool->roles()->sync($toolData['roles']);
        } elseif (isset($toolData['role_ids']) && is_array($toolData['role_ids'])) {
            $tool->roles()->sync($toolData['role_ids']);
        }
        if (isset($toolData['tags']) && is_array($toolData['tags'])) {
            $tool->tags()->sync($toolData['tags']);
        } elseif (isset($toolData['tag_ids']) && is_array($toolData['tag_ids'])) {
            $tool->tags()->sync($toolData['tag_ids']);
        }

        error_log('Tool updated successfully');
        return response()->json($tool);
    } catch (\Exception $e) {
        error_log('Error updating tool: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to update tool: ' . $e->getMessage()], 500);
    }
});

Route::delete('/tools/{id}', function ($id) {
    try {
        $tool = \App\Models\AiTool::findOrFail($id);
        $tool->delete();
        return response()->json(['message' => 'Tool deleted successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete tool: ' . $e->getMessage()], 500);
    }
});

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
