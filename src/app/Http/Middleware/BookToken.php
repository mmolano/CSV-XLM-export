<?php

namespace App\Http\Middleware;

use App\Models\Consumer;
use Closure;
use Illuminate\Http\Request;

class BookToken
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
        if (
            !$request->bearerToken() || !Consumer::where('token', $request->bearerToken())
                ->first()
        ) {
            return response()->json([
                'message' => 'Access not granted'
            ], 401);
        }

        return $next($request);
    }
}