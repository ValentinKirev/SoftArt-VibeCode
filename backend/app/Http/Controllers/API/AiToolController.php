<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAiToolRequest;
use App\Http\Requests\UpdateAiToolRequest;
use App\Models\AiTool;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AiToolController extends Controller
{
    /**
     * Display a listing of the AI tools.
     */
    public function index(): JsonResponse
    {
        try {
            $tools = AiTool::with(['categories', 'roles', 'tags'])->get();
            return response()->json($tools);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch tools: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created AI tool in storage.
     */
    public function store(StoreAiToolRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            
            // Get the current user
            $user = auth()->user();

            // Set is_approved based on user role
            $isApproved = false;
            if ($user) {
                // Check if user has role relationship and if it's the owner role
                if ($user->role && $user->role->slug === 'owner') {
                    $isApproved = true;
                }
                // Also check if user role_id matches the owner role
                elseif ($user->role_id) {
                    $ownerRole = \App\Models\Role::where('slug', 'owner')->first();
                    if ($ownerRole && $user->role_id === $ownerRole->id) {
                        $isApproved = true;
                    }
                }
            }
            
            // Debug logging
            \Log::info('Tool creation - User role check', [
                'user_id' => $user?->id,
                'user_role_id' => $user?->role_id,
                'user_role' => $user?->role,
                'role_slug' => $user?->role?->slug,
                'is_approved' => $isApproved
            ]);
            
            $tool = AiTool::create([
                'name' => $validatedData['name'],
                'slug' => $validatedData['slug'],
                'description' => $validatedData['description'],
                'long_description' => $validatedData['long_description'] ?? null,
                'url' => $validatedData['url'] ?? null,
                'documentation_url' => $validatedData['documentation_url'] ?? null,
                'icon' => $validatedData['icon'] ?? '🤖',
                'color' => $validatedData['color'] ?? '#3B82F6',
                'version' => $validatedData['version'] ?? '1.0.0',
                'status' => $validatedData['status'] ?? 'active',
                'is_active' => $validatedData['is_active'] ?? true,
                'requires_auth' => $validatedData['requires_auth'] ?? false,
                'api_key_required' => $validatedData['api_key_required'] ?? false,
                'is_approved' => $isApproved,
                'usage_limit' => $validatedData['usage_limit'] ?? null,
                'metadata' => $validatedData['metadata'] ?? null,
            ]);

            // Handle relationships
            if (isset($validatedData['categories']) && is_array($validatedData['categories'])) {
                $tool->categories()->attach($validatedData['categories']);
            }
            if (isset($validatedData['roles']) && is_array($validatedData['roles'])) {
                $tool->roles()->attach($validatedData['roles']);
            }
            if (isset($validatedData['tags']) && is_array($validatedData['tags'])) {
                $tool->tags()->attach($validatedData['tags']);
            }

            // Load relationships for response
            $tool->load(['categories', 'roles', 'tags']);

            return response()->json($tool, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create tool: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified AI tool.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $tool = AiTool::with(['categories', 'roles', 'tags'])->findOrFail($id);
            return response()->json($tool);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Tool not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch tool: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified AI tool in storage.
     */
    public function update(UpdateAiToolRequest $request, int $id): JsonResponse
    {
        try {
            $tool = AiTool::findOrFail($id);
            $validatedData = $request->validated();
            
            $tool->update([
                'name' => $validatedData['name'],
                'slug' => $validatedData['slug'],
                'description' => $validatedData['description'],
                'long_description' => $validatedData['long_description'] ?? $tool->long_description,
                'url' => $validatedData['url'] ?? $tool->url,
                'documentation_url' => $validatedData['documentation_url'] ?? $tool->documentation_url,
                'icon' => $validatedData['icon'] ?? $tool->icon,
                'color' => $validatedData['color'] ?? $tool->color,
                'version' => $validatedData['version'] ?? $tool->version,
                'status' => $validatedData['status'] ?? $tool->status,
                'is_active' => $validatedData['is_active'] ?? $tool->is_active,
                'requires_auth' => $validatedData['requires_auth'] ?? $tool->requires_auth,
                'api_key_required' => $validatedData['api_key_required'] ?? $tool->api_key_required,
                'usage_limit' => $validatedData['usage_limit'] ?? $tool->usage_limit,
                'metadata' => $validatedData['metadata'] ?? $tool->metadata,
            ]);

            // Update relationships
            if (isset($validatedData['categories']) && is_array($validatedData['categories'])) {
                $tool->categories()->sync($validatedData['categories']);
            }
            if (isset($validatedData['roles']) && is_array($validatedData['roles'])) {
                $tool->roles()->sync($validatedData['roles']);
            }
            if (isset($validatedData['tags']) && is_array($validatedData['tags'])) {
                $tool->tags()->sync($validatedData['tags']);
            }

            // Load relationships for response
            $tool->load(['categories', 'roles', 'tags']);

            return response()->json($tool);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Tool not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update tool: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified AI tool from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $tool = AiTool::findOrFail($id);
            $tool->delete();
            return response()->json(['message' => 'Tool deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Tool not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete tool: ' . $e->getMessage()], 500);
        }
    }
}
