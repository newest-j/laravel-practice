<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class UserController extends Controller
{
    //the register auth
    public function register(Request $request)
    {
        try {
            $validateData = $request->validate([
                'name' => 'required|string|max:225',
                'email' => 'required|string|email|max:225|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            // so here it knows which table to go to by the model eloquent that maps it 
            // that is a use App\Models\User; maps to a users table and a use App\Models\Training maps to trainings
            $user = User::create([
                // the name email here map to the name of the column in the database
                'name' => $validateData['name'],
                'email' => $validateData['email'],
                'password' => $validateData['password'],
            ]);

            //  storage  user id in the session // session is created by the startsession for the web.php connection to the withrouting in the bootstrap app.php calling the web middleware
            // and the session id is sent to the cookie by the startsession that happens when laravel is running
            Auth::login($user);


            // the session id is regenerated 
            $request->session()->regenerate();

            // rotate CSRF token for the new session
            $request->session()->regenerateToken();



            return response()->json([
                'success' => true,
                'message' => 'Account created successfully',
                // 'user' => $user
                'user' => $request->user()->only(['id', 'name', 'email'])


            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'validation failed',
                'error' => $e->errors()
            ], 422);
        } catch (\Throwable $e) {

            report($e);

            if (app()->environment('local')) {
                throw $e; // show full trace in development
            }

            return response()->json([
                'success' => false,
                'message' => 'Account creation unsuccessful',
            ], 500);
        }
    }


    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt($credentials)) {
                // so the Auth::attempt() need the password field it uses all the non password field to query the database and the password field to do the check and when true it the send the user id to the session
                // unlike the Auth::login() is just log the user in with the user id store in the session
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Regenerate session to prevent fixation
            $request->session()->regenerate();

            // rotate CSRF token for the new session
            $request->session()->regenerateToken();
            // Get the authenticated user
            // $user = Auth::user();

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => $request->user()->only(['id', 'name', 'email'])
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'error' => $e->errors()
            ], 422);
        } catch (\Throwable $e) {
            /* using throwable because it get all the error  of both 
               excception (eg: LogicException,RuntimeException the two types ) and the 
               error (eg CompileError,TypeError,ValueError,ArithmeticError etc)*/
            // log the error to the laravel.log or what ever that is in customize in the logging.php
            report($e);

            // this throws the error in the ui browser in the development stage
            if (app()->environment('local')) {
                throw $e; // show full trace in development
            }


            return response()->json([
                'success' => false,
                'message' => 'Login unsuccessful',
            ], 500);
        }
    }



    public function logout(Request $request)
    {
        try {
            // removes the user id from the session and the the Auth:user() will become null
            Auth::logout();

            //ends the session and regenerate the session id and sends to the browser
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'success' => true,
                'message' => 'Logged out'
            ]);
        } catch (\Exception $e) {

            report($e);

            if (app()->environment('local')) {
                throw $e; // show full trace in development
            }
            return response()->json([
                'success' => false,
                'message' => 'Logout unsuccessful',
            ], 500);
        }
    }
}



// await fetch('/signup', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'X-XSRF-TOKEN': getXsrfTokenFromCookie() // optional if using Sanctum + axios auto CSRF
//   },
//   body: JSON.stringify({
//     name: this.name,
//     email: this.email,
//     password: this.password,
//     password_confirmation: this.password_confirmation
//   }),
//   credentials: 'include' // IMPORTANT: allows cookies to be sent/received
// });