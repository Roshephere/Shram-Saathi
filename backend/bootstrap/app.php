<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Note: Token-based auth (Bearer tokens) is used.
        // EnsureFrontendRequestsAreStateful is NOT prepended globally
        // to avoid CSRF token mismatch on API routes.
        // If switching to SPA cookie auth, add:
        // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // 'is_admin' => \App\Http\Middleware\IsAdmin::class,
        // is admin middleware is added to route groups that require admin access.


        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'is_admin' => \App\Http\Middleware\IsAdmin::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
