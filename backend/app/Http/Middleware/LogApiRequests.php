<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogApiRequests
{
    public function handle(Request $request, Closure $next)
    {
        // Log all API requests
        if ($request->is('api/*')) {
            Log::info('API REQUEST: ' . $request->method() . ' ' . $request->fullUrl(), [
                'path' => $request->path(),
                'headers' => $request->headers->all(),
                'body' => $request->all(),
            ]);
        }

        return $next($request);
    }
}
