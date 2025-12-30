<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AiToolController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// AI Tools API Routes
Route::apiResource('ai-tools', AiToolController::class);
Route::get('ai-tools-meta/categories', [AiToolController::class, 'categories']);
Route::get('ai-tools-meta/teams', [AiToolController::class, 'teams']);
Route::get('ai-tools-meta/tags', [AiToolController::class, 'tags']);





