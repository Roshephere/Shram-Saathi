<?php
namespace App\Services;

use App\Models\ServiceRequest;
use App\Models\Merchant;
use Illuminate\Support\Facades\DB;

class RecommendationService
{
    /**
     * Calculate distance between two coordinates (Haversine formula)
     * Returns distance in kilometers
     */
    public function calculateDistance($lat1, $lon1, $lat2, $lon2): float
    {
        $earth_radius = 6371; // Radius of the earth in km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * asin(sqrt($a));
        return $earth_radius * $c; // Distance in km
    }

    /**
     * Get recommended workers for a service request
     * Based on: Service Category, Distance, Rating, Availability
     */
    public function getRecommendedWorkers(
        int $serviceRequestId,
        int $limit = 5,
        float $maxDistance = 50 // km
    ) {
        $serviceRequest = ServiceRequest::with('userLocation', 'category')->findOrFail($serviceRequestId);
        
        if (!$serviceRequest->userLocation) {
            return [];
        }

        $userLat = $serviceRequest->userLocation->latitude;
        $userLon = $serviceRequest->userLocation->longitude;
        $categoryId = $serviceRequest->category_id;

        // Get all workers offering this service
        $workers = Merchant::query()
            ->with(['user', 'serviceCategories', 'locations'])
            ->whereHas('serviceCategories', function ($query) use ($categoryId) {
                $query->where('service_category_id', $categoryId);
            })
            ->where('status', 'active') // Only approved workers
            ->get()
            ->map(function ($merchant) use ($userLat, $userLon, $maxDistance) {
                // Get worker's primary location
                $primaryLocation = $merchant->locations()
                    ->where('is_primary', true)
                    ->first();

                if (!$primaryLocation) {
                    return null;
                }

                // Calculate distance
                $distance = $this->calculateDistance(
                    $userLat,
                    $userLon,
                    $primaryLocation->latitude,
                    $primaryLocation->longitude
                );

                // Skip if too far
                if ($distance > $maxDistance) {
                    return null;
                }

                return [
                    'merchant_id' => $merchant->id,
                    'user_id' => $merchant->user_id,
                    'business_name' => $merchant->business_name,
                    'hourly_rate' => $merchant->hourly_rate,
                    'avg_rating' => $merchant->avg_rating,
                    'review_count' => $merchant->getReviewCount(),
                    'phone' => $merchant->phone,
                    'location' => $primaryLocation,
                    'distance_km' => round($distance, 2),
                    'score' => $this->calculateRecommendationScore(
                        $distance,
                        $merchant->avg_rating
                    ),
                ];
            })
            ->filter() // Remove nulls
            ->sortByDesc('score') // Sort by recommendation score
            ->take($limit)
            ->values();

        return $workers;
    }

    /**
     * Calculate recommendation score (0-100)
     * Based on distance (40%) and rating (60%)
     */
    private function calculateRecommendationScore(float $distance, float $rating): float
    {
        // Distance score: closer = higher (0-40 points)
        // Assuming max 50km, closer workers get more points
        $distanceScore = max(0, 40 - ($distance / 50 * 40));

        // Rating score: higher rating = higher (0-60 points)
        $ratingScore = ($rating / 5) * 60;

        return $distanceScore + $ratingScore;
    }

    /**
     * Get workers by category only (no distance filter)
     */
    public function getWorkersByCategory(int $categoryId, int $limit = 10)
    {
        return Merchant::with(['user', 'serviceCategories'])
            ->whereHas('serviceCategories', function ($query) use ($categoryId) {
                $query->where('service_category_id', $categoryId);
            })
            ->where('status', 'active')
            ->orderByDesc('avg_rating')
            ->take($limit)
            ->get();
    }
}