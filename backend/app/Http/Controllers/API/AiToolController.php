<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AiTool;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AiToolController extends Controller
{
    /**
     * Display a listing of AI tools.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AiTool::query();

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('tool_type', $request->type);
        }

        // Filter by team
        if ($request->has('team') && $request->team) {
            $query->where('team', $request->team);
        }

        // Filter by tags
        if ($request->has('tag') && $request->tag) {
            $query->whereJsonContains('tags', $request->tag);
        }

        // Search by name or description
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('author_name', 'LIKE', "%{$search}%");
            });
        }

        // Only active tools by default
        if (!$request->has('include_inactive') || !$request->include_inactive) {
            $query->where('is_active', true);
        }

        // Sort by rating or created date
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (in_array($sortBy, ['name', 'category', 'rating', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $tools = $query->with('user:id,name,email,role')->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $tools,
            'message' => 'AI tools retrieved successfully'
        ]);
    }

    /**
     * Store a newly created AI tool.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:100',
            'tool_type' => 'required|string|in:library,application,framework,api,service',
            'url' => 'nullable|url',
            'documentation_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'user_id' => 'required|exists:users,id',
            'author_name' => 'nullable|string|max:255', // Now optional since we have user_id
            'author_email' => 'nullable|email|max:255',
            'team' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'use_case' => 'nullable|string',
            'pros' => 'nullable|string',
            'cons' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ], 422);
        }

        $tool = AiTool::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $tool,
            'message' => 'AI tool created successfully'
        ], 201);
    }

    /**
     * Display the specified AI tool.
     */
    public function show(AiTool $aiTool): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $aiTool,
            'message' => 'AI tool retrieved successfully'
        ]);
    }

    /**
     * Update the specified AI tool.
     */
    public function update(Request $request, AiTool $aiTool): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'nullable|string|max:100',
            'tool_type' => 'sometimes|required|string|in:library,application,framework,api,service',
            'url' => 'nullable|url',
            'documentation_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'user_id' => 'sometimes|exists:users,id',
            'author_name' => 'nullable|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'team' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'use_case' => 'nullable|string',
            'pros' => 'nullable|string',
            'cons' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ], 422);
        }

        $aiTool->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $aiTool,
            'message' => 'AI tool updated successfully'
        ]);
    }

    /**
     * Remove the specified AI tool.
     */
    public function destroy(AiTool $aiTool): JsonResponse
    {
        $aiTool->delete();

        return response()->json([
            'success' => true,
            'message' => 'AI tool deleted successfully'
        ]);
    }

    /**
     * Get categories list.
     */
    public function categories(): JsonResponse
    {
        $categories = AiTool::where('is_active', true)
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
    }

    /**
     * Get teams list.
     */
    public function teams(): JsonResponse
    {
        $teams = AiTool::where('is_active', true)
            ->distinct()
            ->pluck('team')
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $teams,
            'message' => 'Teams retrieved successfully'
        ]);
    }

    /**
     * Get tags list.
     */
    public function tags(): JsonResponse
    {
        $tags = AiTool::where('is_active', true)
            ->pluck('tags')
            ->filter()
            ->flatten()
            ->unique()
            ->values()
            ->sort();

        return response()->json([
            'success' => true,
            'data' => $tags,
            'message' => 'Tags retrieved successfully'
        ]);
    }
}
