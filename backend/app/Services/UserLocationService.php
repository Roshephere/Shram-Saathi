<?php
namespace App\Services;

use App\Models\User;
use App\Models\UserLocation;
use Illuminate\Support\Facades\DB;

class UserLocationService
{
    /**
     * Add location to user
     */
    public function addLocation(int $userId, array $data): UserLocation
    {
        return DB::transaction(function () use ($userId, $data) {
            // If this is primary, remove primary from others
            if ($data['is_primary'] ?? false) {
                UserLocation::where('user_id', $userId)
                    ->update(['is_primary' => false]);
            }

            return UserLocation::create([
                'user_id' => $userId,
                'label' => $data['label'] ?? 'Home',
                'country' => $data['country'] ?? 'India',
                'address' => $data['address'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'is_primary' => $data['is_primary'] ?? false,
                'is_active' => $data['is_active'] ?? true,
                'extras' => $data['extras'] ?? null,
            ]);
        });
    }

    /**
     * Update user location
     */
    public function updateLocation(int $locationId, array $data): UserLocation
    {
        $location = UserLocation::findOrFail($locationId);

        return DB::transaction(function () use ($location, $data) {
            if ($data['is_primary'] ?? false) {
                UserLocation::where('user_id', $location->user_id)
                    ->update(['is_primary' => false]);
            }

            $location->update($data);
            return $location->fresh();
        });
    }

    /**
     * Get user's locations
     */
    public function getUserLocations(int $userId)
    {
        return UserLocation::where('user_id', $userId)
            ->where('is_active', true)
            ->get();
    }

    /**
     * Get user's primary location
     */
    public function getPrimaryLocation(int $userId)
    {
        return UserLocation::where('user_id', $userId)
            ->where('is_primary', true)
            ->first();
    }
}