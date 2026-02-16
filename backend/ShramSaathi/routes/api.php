<?php

use App\Http\Controllers\AdminMerchantController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\SkillController;
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

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/updatePassword', [AuthController::class, 'updatePassword']);
    Route::post('/updateProfile', [AuthController::class, 'updateProfile']);
});


Route::get('auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

//attaching and detaching skills
Route::post('merchants/{merchant}/skills',[SkillController::class, 'attachToMerchant']);
Route::delete('merchants/{merchant}/skills/{skill}',[SkillController::class, 'detachFromMerchant']);

//merchants
Route::apiResource('merchants', MerchantController::class);
Route::apiResource('skills', SkillController::class);

// Admin-only merchant actions
Route::put('admin/merchants/{merchant}', [AdminMerchantController::class, 'update']);
Route::post('admin/merchants/{merchant}/verify', [AdminMerchantController::class, 'verify']);
Route::post('admin/merchants/{merchant}/suspend', [AdminMerchantController::class, 'suspend']);