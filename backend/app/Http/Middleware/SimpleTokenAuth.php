<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class SimpleTokenAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }
        
        // Check if it's our simple token format: laravel-token-{user_id}-{timestamp}
        if (preg_match('/^laravel-token-(\d+)-\d+$/', $token, $matches)) {
            $userId = $matches[1];
            $user = User::find($userId);
            
            if ($user) {
                // Authenticate the user for this request
                auth()->setUser($user);
                return $next($request);
            }
        }
        
        return response()->json(['error' => 'Invalid token'], 401);
    }
}
