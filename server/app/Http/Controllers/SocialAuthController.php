<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str; // add this

class SocialAuthController extends Controller
{
    public function redirectToGoogle(string $mode)
    {
        // Keep a fixed callback; store mode in session
        $mode = in_array($mode, ['login', 'signup'], true) ? $mode : null;
        session(['oauth_mode' => $mode]);

        // this generate a state value which is a random string that is save to the laravel session and redirect with to google
        //this is to make a force pick for every signup so that i can switch between account
        $response = Socialite::driver('google')->redirect(); // this just redirect to the google oauth page it is google that calls the redirect back the callback url
        $url = $response->getTargetUrl();
        $shouldForcePicker = $mode === 'signup';
        if ($shouldForcePicker) {
            $sep = str_contains($url, '?') ? '&' : '?';
            // the http_build_query is use for safly appending things like encoding space to +
            $url .= $sep . http_build_query(['prompt' => 'select_account']);
        }

        return redirect()->away($url);
    }




    public function handleGoogleCallback(Request $request)
    {
        try {
            // when the callback is coming it comes with the state value and a code and the code is exchange for na access token that is use to fetch the google profile
            // the token is to call the google api the token is like an authorization given to my application(this app/site) to access google and get the user profile
            $googleUser = Socialite::driver('google')->user();

            $email = strtolower(trim($googleUser->getEmail() ?? ''));
            $raw = $googleUser->user;
            $verified = $raw['email_verified'] ?? $raw['verified_email'] ?? false;

            $spa = rtrim(env('FRONTEND_ORIGIN', 'http://localhost:5173'), '/');

            if (!$email || !$verified) {
                return redirect()->away($spa . '/oauth/callback?ok=0&error=unverified_email');
            }

            $user = User::where('email', $email)->first();

            // Read and clear mode from session
            $mode = $request->session()->pull('oauth_mode');

            if ($mode === 'login') {
                if (!$user) {
                    return redirect()->away($spa . '/oauth/callback?ok=0&error=user_not_found');
                }
                Auth::login($user);
                $request->session()->regenerate();
                $request->session()->regenerateToken();
                return redirect()->away($spa . '/oauth/callback?ok=1');
            }

            if ($mode === 'signup') {
                if ($user) {
                    return redirect()->away($spa . '/oauth/callback?ok=0&error=already_registered');
                }
                $user = User::create([
                    'name' => $googleUser->getName() ?: ($googleUser->getNickname() ?: 'Google User'),
                    'email' => $email,
                    'password' => Str::random(40), // random password to satisfy not-null
                    'email_verified_at' => now(),
                    // If you have a google_id column, include it:
                    'google_id' => $googleUser->getId(),
                ]);

                Auth::login($user);
                $request->session()->regenerate();
                $request->session()->regenerateToken();
                return redirect()->away($spa . '/oauth/callback?ok=1');
            }
        } catch (\Throwable $e) {
            report($e);
            if (app()->environment('local')) {
                throw $e; // show full trace in development
            }
            $spa = rtrim(env('FRONTEND_ORIGIN', 'http://localhost:5173'), '/');
            return redirect()->away($spa . '/oauth/callback?ok=0&error=server_error');
        }
    }
}


// routes/web.php
// Route::get('/auth/google/redirect/{mode}', [SocialAuthController::class, 'redirectToGoogle']);
// Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
