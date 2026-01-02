<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SimpleCors
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        // Add CORS headers to all responses
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
        
        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            $response->setStatusCode(200);
            return $response;
        }
        
        return $response;
    }
}
