<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminMerchantController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\MerchantCategoryController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\MerchantRegistrationController;
use App\Http\Controllers\MerchantServiceCategoryController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceRequestsController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserLocationController;
use App\Http\Controllers\RecommendationModelController;
use App\Http\Controllers\MerchantLocationsController;
use App\Http\Controllers\MerchantReviewController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

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

Route::get('give-role', function () {
    $user = \App\Models\User::find(1);
    // dd($user->assignRole('admin'));
$role = Role::where('name', 'admin')
        ->where('guard_name', 'sanctum')
        ->firstOrFail();

    $user->assignRole($role);    return 'Permission granted';
});
Route::get('give-worker-role', function () {
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    $user = User::where('email', 'john@example.com')->firstOrFail();

    $workerRole = Role::firstOrCreate([
        'name' => 'worker',
        'guard_name' => 'sanctum',
    ]);

    $user->assignRole($workerRole);

    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    return 'Worker role granted to John';
});

Route::middleware(['auth:sanctum'])->group(function () {
    // Booking routes - RESTRUCTURED for marketplace model
    Route::middleware('auth:sanctum')->group(function () {
        // Merchant creates bid, Customer views bids
        Route::post('bookings', [BookingController::class, 'store']);
        Route::get('bookings', [BookingController::class, 'index']); // ?service_request_id={id}
        Route::get('bookings/{id}', [BookingController::class, 'show']);

        // Customer actions on bids
        Route::put('bookings/{id}/accept', [BookingController::class, 'accept']);
        Route::delete('bookings/{id}', [BookingController::class, 'destroy']);

        // Merchant actions on work
        Route::put('bookings/{id}/start', [BookingController::class, 'start']);
        Route::put('bookings/{id}/complete', [BookingController::class, 'complete']);
        Route::put('bookings/{id}/reject', [BookingController::class, 'reject']);

        // Get customer's bookings
        Route::get('customer/bookings', [BookingController::class, 'customerBookings']);
        
        // Get merchant's bookings
        Route::get('merchant/bookings', [BookingController::class, 'merchantBookings']);
    });

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/updatePassword', [AuthController::class, 'updatePassword']);
    Route::post('/updateProfile', [AuthController::class, 'updateProfile']);
    Route::post('refresh-token', [AuthController::class, 'refresh'])->name('refresh');

    // Registration steps for merchants routes
    Route::get('/worker/registration/status/{userId}', [MerchantRegistrationController::class, 'checkStatus']);
    Route::post('/worker/register/step2/{userId}', [MerchantRegistrationController::class, 'step2']);
    Route::post('/worker/register/step3/{merchantId}', [MerchantRegistrationController::class, 'step3']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/user/reviews', [UserController::class, 'reviews']);

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

    Route::apiResource('merchant-locations', MerchantLocationsController::class);

    Route::apiResource('service-requests', ServiceRequestsController::class)->whereNumber('service_request');
    Route::get('service-requests/user/list', [ServiceRequestsController::class, 'userRequests']);
    Route::get('service-requests/available', [ServiceRequestsController::class, 'availableRequests']);

    // Merchant Reviews
    Route::get('merchants/{merchantId}/reviews', [MerchantReviewController::class, 'index']);
    Route::post('reviews', [MerchantReviewController::class, 'store']);
    Route::get('reviews/{id}', [MerchantReviewController::class, 'show']);
    Route::delete('reviews/{id}', [MerchantReviewController::class, 'destroy']);

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
// Route::apiResource('skills', SkillController::class);
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


// Route::get('/set-cookie',function(){
//     return response('Cookie Set')->cookie('username', 'roshab', 60);
// });


Route::get('get-cookie', [CookieController::class, 'handleGetCookie']);
Route::get('set-cookie', [CookieController::class, 'handleSetCookie']);
Route::get('delete-cookie', [CookieController::class, 'deleteCookie']);
Route::get('theme-set', function () {
    return response()->json(['theme'])->cookie('theme', 'red', 60);
});


// Admin routes
Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {
    Route::get('merchants/pending', [AdminController::class, 'getPendingMerchants']);
    Route::put('merchants/{merchantId}/verify', [AdminController::class, 'verifyMerchant']);
    Route::put('merchants/{merchantId}/reject', [AdminController::class, 'rejectMerchant']);
    Route::put('merchants/{merchantId}/suspend', [AdminController::class, 'suspendMerchant']);
    Route::put('merchants/{merchantId}/resubmit', [AdminController::class, 'resubmitMerchant']);


    // Admin-only merchant actions
// Route::put('merchants/{merchant}', [AdminMerchantController::class, 'update']);
// Route::post('merchants/{merchant}/verify', [AdminMerchantController::class, 'verify']);
// Route::post('merchants/{merchant}/suspend', [AdminMerchantController::class, 'suspend']);

    // booking route
    Route::get('bookings', [AdminController::class, 'getBookings']);
    Route::get('transactions', [AdminController::class, 'getTransactions']);
    Route::get('dashboard', [AdminController::class, 'getDashboard']);

    // Reviews
    Route::get('reviews', [AdminController::class, 'getReviews']);
    Route::put('reviews/{reviewId}/verify', [AdminController::class, 'verifyReview']);
    Route::put('reviews/{reviewId}/reject', [AdminController::class, 'rejectReview']);

    Route::apiResource('roles', RoleController::class);
    Route::post('roles/seed-defaults', [RoleController::class, 'seedDefaults']);
});

// User role management (authenticated users, admin-only actions checked in controller)
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::put('users/{userId}/roles', [RoleController::class, 'syncUserRoles']);
    Route::post('users/{userId}/roles', [RoleController::class, 'assignRoleToUser']);
    Route::delete('users/{userId}/roles/{roleName}', [RoleController::class, 'removeRoleFromUser']);
});

// Get own roles (any authenticated user can see their own)
Route::middleware('auth:sanctum')->get('users/{userId}/roles', [RoleController::class, 'getUserRoles']);