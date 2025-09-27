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
    // /sanctum/csrf-cookie this is what set the route for the crsf in laravel by sanctum 
    // check the route list to see
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);


    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [UserController::class, 'logout']);
        Route::get('/user',  fn(Request $request) => $request->user()->only(['id', 'name', 'email']));
    });
});


// ORM is the concept that  a programming language that allows you 
// to interact with the database using object 
// instead of writting raw sql queries and the
// eloquest is the implementation a laravel library
// that makes this possible User:all $user->name
