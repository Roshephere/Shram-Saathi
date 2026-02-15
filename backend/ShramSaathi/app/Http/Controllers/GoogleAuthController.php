<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle(){
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
        return response()->json([
            'url'=> $url
        ]);

    }

    public function handleGoogleCallback(){
        try{
     // Get user info from Google
            $googleUser = Socialite::driver('google')
                ->stateless() 
                ->user();
            
            // Find or create user
            $user = User::where('google_id', $googleUser->id)->first();
            
            if ($user) {
                $user->update([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                ]);
            } else {
                $user = User::where('email', $googleUser->email)->first();
                
                if ($user) {
                    $user->update([
                        'google_id' => $googleUser->id,
                    ]);
                } else {
                    $user = User::create([
                        'name' => $googleUser->name,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
                        'password' => Hash::make(Str::random(16)), 
                        'email_verified_at' => now(), 
                    ]);
                }
            }
            
            // Create Sanctum token
            $token = $user->createToken('google-auth-token')->plainTextToken;
            
            // For SPA: Redirect to frontend with token
            // $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            // return redirect()->away("{$frontendUrl}/auth/callback?token={$token}");
            
            // Alternative: Return JSON (if handling callback via API)
             return response()->json([
                'success' => true,
                'message'=> 'User logged in successfully.'
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                ],
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'success'=> false,
                'message'=> 'Failed to login using google',$e->getMessage(),
            ]);
        }
    }
}
