<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class ApiAuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        try {
            Log::info('API LOGIN CONTROLLER CALLED!', ['email' => $request->email]);
            
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();
            Log::info('User found', ['user_id' => $user ? $user->id : null]);

            if (!$user || !Hash::check($request->password, $user->password)) {
                Log::warning('Authentication failed', ['email' => $request->email]);
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            Log::info('Authentication successful', ['user_id' => $user->id]);

            // Create a simple token for the session
            $token = 'laravel-token-' . $user->id . '-' . time();

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
            
            Log::info('Role name determined', ['role_name' => $roleName]);
            Log::info('Login response structure', [
                'role_id' => $user->role_id,
                'role_name' => $roleName,
                'role_slug' => $roleSlug,
                'role_object' => [
                    'id' => $roleId,
                    'name' => $roleName,
                    'slug' => $roleSlug,
                ]
            ]);

            return response()->json([
                'message' => 'Login successful',
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
                ],
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            Log::error('Login error', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated user info.
     */
    public function user(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        // Get role name directly using role_id
        $roleName = 'Unknown';
        if ($user->role_id) {
            $role = \App\Models\Role::find($user->role_id);
            if ($role) {
                $roleName = $role->name; // Use the role name, not slug
            }
        }
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roleName, // Use the proper role name
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ], 200);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}
