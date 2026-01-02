<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Debug logging
        error_log('CorsMiddleware: Processing ' . $request->method() . ' ' . $request->path());
        error_log('CorsMiddleware: Headers: ' . json_encode($request->headers->all()));
        
        // Add CORS headers to all responses
        $response = $next($request);
        
        // Handle preflight OPTIONS requests
        if ($request->isMethod('OPTIONS')) {
            error_log('CorsMiddleware: Handling OPTIONS preflight');
            $response->setStatusCode(200);
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-TOKEN');
            return $response;
        }
        
        // Add CORS headers to all other responses
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-TOKEN');
        
        error_log('CorsMiddleware: Added CORS headers to response');
        return $response;
    }
}
