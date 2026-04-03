<?php

use App\Http\Controllers\AdminMerchantController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\SkillController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', function(){
    return view('login');
});
Route::get('/user', function(){
    $user = User::all();
    return response()->json([
        'message'=> 'User obtained successfully.',
        'data' => $user,
    ]);
});

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/withoutCache', [ArticleController::class, 'allWithoutCache']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/updatePassword', [AuthController::class, 'updatePassword']);
    Route::post('/updateProfile', [AuthController::class, 'updateProfile']);
    Route::post('refresh-token', [AuthController::class, 'refresh'])->name('refresh');
    
});


Route::get('auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
Route::get('auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

//attaching and detaching skills
Route::post('merchants/{merchant}/skills',[SkillController::class, 'attachToMerchant']);
Route::delete('merchants/{merchant}/skills/{skill}',[SkillController::class, 'detachFromMerchant']);

//merchants
Route::apiResource('merchants', MerchantController::class);
Route::apiResource('skills', SkillController::class);
Route::apiResource('faqs', FaqController::class);

// Admin-only merchant actions
Route::put('admin/merchants/{merchant}', [AdminMerchantController::class, 'update']);
Route::post('admin/merchants/{merchant}/verify', [AdminMerchantController::class, 'verify']);
Route::post('admin/merchants/{merchant}/suspend', [AdminMerchantController::class, 'suspend']);

// Route::get('/set-cookie',function(){
//     return response('Cookie Set')->cookie('username', 'roshab', 60);
// });


Route::get('get-cookie',[CookieController::class,'handleGetCookie']);
Route::get('set-cookie',[CookieController::class,'handleSetCookie']);
Route::get('delete-cookie',[CookieController::class, 'deleteCookie']);
Route::get('theme-set', function(){
    return response()->json(['theme'])->cookie('theme', 'red', 60);
});