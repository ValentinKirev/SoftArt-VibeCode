<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HandleCorsWithCredentials
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        // Get the origin from the request
        $origin = $request->header('Origin');
        
        // Allow specific origins
        $allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
        
        if (in_array($origin, $allowedOrigins)) {
            // Set CORS headers for credentials
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, X-CSRF-TOKEN');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Max-Age', '0');
        }
        
        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            $response->setStatusCode(200);
            return $response;
        }
        
        return $response;
    }
}
