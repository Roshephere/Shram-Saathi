<?php

use App\Http\Controllers\AdminMerchantController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\MerchantCategoryController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\MerchantRegistrationController;
use App\Http\Controllers\MerchantServiceCategoryController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\UserLocationController;
use App\Http\Controllers\RecommendationModelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/worker/register/step1', [MerchantRegistrationController::class, 'step1']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', function () {
    return view('login');
});
// Route::get('/user', function () {
//     $user = User::all();
//     return response()->json([
//         'message' => 'User obtained successfully.',
//         'data' => $user,
//     ]);
// });

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/withoutCache', [ArticleController::class, 'allWithoutCache']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/updatePassword', [AuthController::class, 'updatePassword']);
    Route::post('/updateProfile', [AuthController::class, 'updateProfile']);
    Route::post('refresh-token', [AuthController::class, 'refresh'])->name('refresh');

    // Registration steps for merchants routes
    Route::get('/worker/registration/status/{userId}', [MerchantRegistrationController::class, 'checkStatus']);
    Route::post('/worker/register/step2/{userId}', [MerchantRegistrationController::class, 'step2']);
    Route::post('/worker/register/step3/{merchantId}', [MerchantRegistrationController::class, 'step3']);

    // Service categories create
    Route::get('/service-categories', [ServiceCategoryController::class, 'index']);
    Route::post('/service-categories', [ServiceCategoryController::class, 'store']);
    Route::get('/service-categories/{id}', [ServiceCategoryController::class, 'show']);
    Route::put('/service-categories/{id}', [ServiceCategoryController::class, 'update']);
    Route::delete('/service-categories/{id}', [ServiceCategoryController::class, 'destroy']);

    // User Locations
    Route::get('/user/locations', [UserLocationController::class, 'index']);
    Route::post('/user/locations', [UserLocationController::class, 'store']);
    Route::put('/user/locations/{locationId}', [UserLocationController::class, 'update']);
    Route::delete('/user/locations/{locationId}', [UserLocationController::class, 'destroy']);

    
    });
    // Recommendations
    Route::get('/recommendations/service-request/{serviceRequestId}', [RecommendationModelController::class, 'getForServiceRequest']);
    Route::get('/recommendations/category/{categoryId}', [RecommendationModelController::class, 'getByCategory']);


Route::get('auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
Route::get('auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

//attaching and detaching skills
Route::post('merchants/{merchant}/skills', [SkillController::class, 'attachToMerchant']);
Route::delete('merchants/{merchant}/skills/{skill}', [SkillController::class, 'detachFromMerchant']);

//merchants
Route::apiResource('merchants', MerchantController::class);
Route::apiResource('skills', SkillController::class);
Route::apiResource('faqs', FaqController::class);

// Merchant Service Categories Management
Route::get('merchants/{merchantId}/service-categories', [MerchantServiceCategoryController::class, 'index']);
Route::post('merchants/{merchantId}/service-categories', [MerchantServiceCategoryController::class, 'attach']);
Route::put('merchants/{merchantId}/service-categories/sync', [MerchantServiceCategoryController::class, 'sync']);
Route::put('merchants/{merchantId}/service-categories/{categoryId}', [MerchantServiceCategoryController::class, 'update']);
Route::delete('merchants/{merchantId}/service-categories/{categoryId}', [MerchantServiceCategoryController::class, 'detach']);
Route::get('available-service-categories', [MerchantServiceCategoryController::class, 'getAvailableCategories']);

//merchant categories
Route::get('merchant-categories', [MerchantCategoryController::class, 'index']);

// Admin-only merchant actions
Route::put('admin/merchants/{merchant}', [AdminMerchantController::class, 'update']);
Route::post('admin/merchants/{merchant}/verify', [AdminMerchantController::class, 'verify']);
Route::post('admin/merchants/{merchant}/suspend', [AdminMerchantController::class, 'suspend']);

// Route::get('/set-cookie',function(){
//     return response('Cookie Set')->cookie('username', 'roshab', 60);
// });


Route::get('get-cookie', [CookieController::class, 'handleGetCookie']);
Route::get('set-cookie', [CookieController::class, 'handleSetCookie']);
Route::get('delete-cookie', [CookieController::class, 'deleteCookie']);
Route::get('theme-set', function () {
    return response()->json(['theme'])->cookie('theme', 'red', 60);
});