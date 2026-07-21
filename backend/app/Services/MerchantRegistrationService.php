<?php

namespace App\Services;

use App\Models\Merchant;
use App\Models\MerchantLocation;
use App\Models\User;
use Illuminate\Support\Facades\DB;


class MerchantRegistrationService{

    public function registerUser(array $data){
        
    return DB::transaction(function () use ($data) {
        // Create the merchant
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'phone' => $data['phone'] ?? null,
            // 'status'=> true,
            'registration_step'=> 1,
            'registration_status'=> 'in_progress',
        ]);

        // Additional logic for registration (e.g., sending welcome email)

        return $user;
    });
    }

    public function createMerchantProfile(int $userId, array $data){
        // Validate and create merchant
        return DB::transaction(function () use ($userId, $data){
            // Create merchant profile
            $merchant = Merchant::create([
                'user_id' => $userId,
                'business_name' => $data['business_name'] ?? null,
                'phone' => $data['phone'] ?? null,
                'pan_no' => $data['pan_no'] ?? null,
                'hourly_rate' => $data['hourly_rate'] ?? null,
                'logo' => $data['logo'] ?? null,
                'location' => $data['location'] ?? null,
                'status' => 'pending',
            ]);

            // Attach service categories if provided
            if(!empty($data['service_category_ids'])){
                $merchant->serviceCategories()->attach($data['service_category_ids']);
            }

            // Update user's registration step (Step 2 complete)
            User::findOrFail($userId)->update([
                'registration_step' => 2,
                'registration_status' => 'in_progress',
            ]);

            return $merchant->load('serviceCategories');
        });

    }

    // adding worker location

    public function addWorkerLocation(int $merchantId,  array $data){
        return DB::transaction(function () use ($merchantId, $data){
            $merchant = Merchant::findOrFail($merchantId);
            $user = $merchant->user;
            $location =MerchantLocation::create([
                'merchant_id'=> $merchantId,
                'label'=> $data['label'] ?? null,
                'country'=> $data['country'] ?? null,
                'address'=> $data['address'] ?? null,
                'latitude'=> $data['latitude'] ?? null,
                'longitude'=> $data['longitude'] ?? null,
                'is_primary'=> $data['is_primary'] ?? false,
                'is_active'=> $data['is_active'] ?? true,
                'extras'=> $data['extras'] ?? null,
            ]);

            $user->update([
                'registration_step' => 3,
                'registration_status' => 'complete',
                'registration_completed_at' => now(),
                // 'role' => 'merchant',
            ]);
            $user->assignRole('worker');

            return $location;
        });
    }

    public function completeRegistration( array $userData, array $workerData, array $locationData){
        return DB::transaction(function () use ($userData, $workerData, $locationData){
            $user = $this->registerUser($userData);
            $worker = $this->createMerchantProfile($user->id, $workerData);
            $location  = $this->addWorkerLocation($worker->id, $locationData);
            
            return [
                'user'=> $user,
                'merchant'=> $worker,
                'location'=> $location,
            ];
        });
    }
}