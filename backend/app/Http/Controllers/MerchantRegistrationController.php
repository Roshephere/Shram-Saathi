<?php

namespace App\Http\Controllers;

use App\Http\Requests\MerchantRequest;
use App\Http\Requests\UserRequest;
use App\Services\MerchantRegistrationService;
use App\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;

class MerchantRegistrationController extends Controller
{
    use ApiResponse;

    public function __construct(protected MerchantRegistrationService $merchantRegistrationService)
    {}

    /**
     * Check current registration status
     * GET /worker/registration/status/{userId}
     */
    public function checkStatus($userId)
    {
        try {
            $user = User::findOrFail($userId);

            return $this->success([
                'user_id' => $user->id,
                'current_step' => $user->registration_step,
                'status' => $user->registration_status,
                'is_complete' => $user->isRegistrationComplete(),
                'completed_at' => $user->registration_completed_at,
            ], 'Registration status retrieved');
        } catch (\Exception $e) {
            return $this->error('User not found', 404);
        }
    }

    /**
     * STEP 1: Register user account
     * POST /worker/register/step1
     */
    public function step1(UserRequest $request)
    {
        try {
            $data = $request->validated();
            $user = $this->merchantRegistrationService->registerUser($data);

            $token = $user->createToken('auth_token', ['*'], now()->addHours(24))->plainTextToken;

            return $this->success(
                [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'token' => $token,
                    'current_step' => $user->registration_step,
                    'next_step' => 2,
                ],
                'Step 1 Complete! Now proceed to Step 2 (Merchant Profile)',
                201
            );
        } catch (\Exception $e) {
            return $this->error(
                'Failed to register user: ' . $e->getMessage(),
                400
            );
        }
    }

    /**
     * STEP 2: Create merchant profile
     * POST /worker/register/step2/{userId}
     */
    public function step2($userId, MerchantRequest $request)
    {
        try {
            $user = User::findOrFail($userId);

            // Validate user is on step 1
            if ($user->registration_step !== 1) {
                return $this->error(
                    'Invalid step. You are on step ' . $user->registration_step,
                    400
                );
            }

            $data = $request->validated();
            $merchant = $this->merchantRegistrationService->createMerchantProfile($userId, $data);

            return $this->success(
                [
                    'merchant_id' => $merchant->id,
                    'user_id' => $merchant->user_id,
                    'business_name' => $merchant->business_name,
                    'service_categories' => $merchant->serviceCategories,
                    'current_step' => $user->refresh()->registration_step,
                    'next_step' => 3,
                ],
                'Step 2 Complete! Now proceed to Step 3 (Location)',
                201
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->error('User not found', 404);
        } catch (\Exception $e) {
            return $this->error(
                'Failed to create merchant profile: ' . $e->getMessage(),
                400
            );
        }
    }

    /**
     * STEP 3: Add worker location
     * POST /worker/register/step3/{merchantId}
     */
    public function step3($merchantId, Request $request)
    {
        try {
            $merchant = \App\Models\Merchant::findOrFail($merchantId);
            $user = $merchant->user;

            // Validate user is on step 2
            if ($user->registration_step !== 2) {
                return $this->error(
                    'Invalid step. You are on step ' . $user->registration_step,
                    400
                );
            }

            $data = $request->validate([
                'label' => 'required|string|max:255',
                'country' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
                'is_primary' => 'boolean',
                'is_active' => 'boolean',
                'extras' => 'nullable|array',
            ]);

            $location = $this->merchantRegistrationService->addWorkerLocation($merchantId, $data);

            return $this->success(
                [
                    'location_id' => $location->id,
                    'merchant_id' => $location->merchant_id,
                    'address' => $location->address,
                    'is_primary' => $location->is_primary,
                    'current_step' => $user->refresh()->registration_step,
                    'registration_complete' => true,
                ],
                'Registration Complete! Worker profile is pending admin verification.',
                201
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->error('Merchant not found', 404);
        } catch (\Exception $e) {
            return $this->error(
                'Failed to add location: ' . $e->getMessage(),
                400
            );
        }
    }
}
