<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SocialAuthController;



// Google OAuth (full-page redirect)
// so the reason the {mode} here get the login or the sinup here is because of the parenthesis it defines it has a route parameter
// where mode = login or signup
Route::get('/auth/google/redirect/{mode}', [SocialAuthController::class, 'redirectToGoogle'])->where('mode', 'login|signup');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

Route::prefix('api')->group(function () {
    // Add CSRF endpoint for Laravel sessions
    Route::get('/csrf-cookie', function (Request $request) {
        return response()->json(['message' => 'CSRF cookie set']);
    });

    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);


    Route::middleware('auth')->group(function () {
        Route::post('/logout', [UserController::class, 'logout']);
        Route::get('/user',  fn(Request $request) => $request->user()->only(['id', 'name', 'email']));
    });
});
