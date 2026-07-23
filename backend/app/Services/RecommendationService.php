<?php
namespace App\Services;

use App\Models\ServiceRequest;
use App\Models\Merchant;
use App\Utils\GeoHash;
use Illuminate\Support\Facades\DB;

class RecommendationService
{
    private ?ContentRecommendationService $contentService = null;
    private ?CollaborativeFilteringService $cfService = null;
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
        float $maxDistance = 25 // km
    ) {
        $serviceRequest = ServiceRequest::with('userLocation', 'category')->findOrFail($serviceRequestId);
        
        if (!$serviceRequest->userLocation) {
            return [];
        }

        $userLat = $serviceRequest->userLocation->latitude;
        $userLon = $serviceRequest->userLocation->longitude;
        $categoryId = $serviceRequest->category_id;


         // ─── GEOHASH PRE-FILTER ───────────────────────────────
        // Compute a geohash prefix based on search radius.
        // For 25km → precision 4 (~39km cells), for 10km → precision 5 (~5km cells)
        // This cuts the dataset from thousands to hundreds BEFORE processes it.
        $prefixLength = GeoHash::precisionForRadius($maxDistance, $userLat);
        $userGeohashPrefix = substr(
            GeoHash::encode($userLat, $userLon, 8),
            0,
            $prefixLength
        );

        // Get all workers offering this service
        $workers = Merchant::query()
            ->with(['user', 'serviceCategories', 'locations'])
            ->whereHas('serviceCategories', function ($query) use ($categoryId) {
                $query->where('service_category_id', $categoryId);
            })
            ->where('status', 'active') // Only approved workers
            // Geo hash: filter.
            ->whereHas('locations', function ($query) use ($userGeohashPrefix) {
                $query->where('is_primary', true)
                      ->where('geohash', 'like', $userGeohashPrefix . '%');
            })
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
                        $merchant->avg_rating ?? 0
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
        // Assuming max 25km, closer workers get more points
        $distanceScore = max(0, 40 - ($distance / 25 * 40));

        // Rating score: higher rating = higher (0-60 points)
        $ratingScore = ($rating / 5) * 60;

        return $distanceScore + $ratingScore;
    }

    /**
     * Get workers by category, optionally filtered by distance when lat/lng provided
     */
    public function getWorkersByCategory(int $categoryId, int $limit = 10, ?float $userLat = null, ?float $userLon = null, float $maxDistance = 25)
    {
        $query = Merchant::with(['user', 'serviceCategories', 'locations'])
            ->whereHas('serviceCategories', function ($query) use ($categoryId) {
                $query->where('service_category_id', $categoryId);
            })
            ->where('status', 'active');

        // Geohash pre-filter when location is provided
        if ($userLat && $userLon) {
            $prefixLength = GeoHash::precisionForRadius($maxDistance, $userLat);
            $userGeohashPrefix = substr(
                GeoHash::encode($userLat, $userLon, 8),
                0,
                $prefixLength
            );

            $query->whereHas('locations', function ($q) use ($userGeohashPrefix) {
                $q->where('is_primary', true)
                  ->where('geohash', 'like', $userGeohashPrefix . '%');
            });
        }

        $merchants = $query->orderByDesc('avg_rating')
            ->take($limit * 3) // fetch extra to account for distance filtering
            ->get();

        return $merchants->map(function ($merchant) use ($userLat, $userLon, $maxDistance) {
            $primaryLocation = $merchant->locations->firstWhere('is_primary', true) ?? $merchant->locations->first();

            $data = $merchant->toArray();
            $data['location'] = $primaryLocation?->toArray();

            if ($primaryLocation && $userLat && $userLon) {
                $distance = $this->calculateDistance(
                    $userLat, $userLon,
                    (float) $primaryLocation->latitude,
                    (float) $primaryLocation->longitude
                );
                $data['distance_km'] = round($distance, 2);

                // Skip workers beyond max distance
                if ($distance > $maxDistance) {
                    return null;
                }

                $data['score'] = $this->calculateRecommendationScore($distance, $merchant->avg_rating ?? 0);
            } else {
                $data['distance_km'] = null;
                $data['score'] = ($merchant->avg_rating ?? 0) / 5 * 100;
            }

            return $data;
        })
        ->filter()
        ->sortByDesc('score')
        ->take($limit)
        ->values();
    }

    /**
     * Hybrid recommendations: geo+rating + TF-IDF content + collaborative filtering
     *
     * Blend formula:
     *   final_score = (geo_rating * w1) + (content_norm * w2) + (cf_score_norm * w3)
     *
     * Where w1 + w2 + w3 = 1.0, each score component normalized to 0-100
     */
    public function getHybridRecommendations(
        int $serviceRequestId,
        int $limit = 5,
        float $maxDistance = 25,
        float $geoWeight = 0.5,
        float $contentWeight = 0.3,
        float $cfWeight = 0.2
    ) {
        $serviceRequest = ServiceRequest::with('category')->find($serviceRequestId);
        if (!$serviceRequest) return [];

        $geoResults = $this->getRecommendedWorkers($serviceRequestId, $limit * 3, $maxDistance);

        $this->contentService = $this->contentService ?? new ContentRecommendationService();
        $contentResults = $this->contentService->getRecommendations($serviceRequest, $limit * 3);

        $this->cfService = $this->cfService ?? new CollaborativeFilteringService();
        $cfResults = $this->cfService->getRecommendationsForUser(
            $serviceRequest->user_id,
            $serviceRequest->category_id,
            $limit * 3
        );

        $contentMap = [];
        foreach ($contentResults as $cr) {
            $contentMap[$cr['merchant_id']] = $cr['content_score'];
        }

        $hybrid = [];
        foreach ($geoResults as $result) {
            $merchantId = $result['merchant_id'];
            $geoRatingScore = $result['score'] ?? 0;

            $rawContentScore = $contentMap[$merchantId] ?? 0;
            $contentScoreNormalized = $rawContentScore * 100;

            $rawCfScore = $cfResults[$merchantId] ?? 0;
            $cfScoreNormalized = ($rawCfScore / 5) * 100;

            $finalScore = ($geoRatingScore * $geoWeight)
                        + ($contentScoreNormalized * $contentWeight)
                        + ($cfScoreNormalized * $cfWeight);

            $result['geo_rating_score'] = round($geoRatingScore, 2);
            $result['content_score'] = round($rawContentScore, 4);
            $result['collaborative_score'] = round($rawCfScore, 4);
            $result['score'] = round($finalScore, 2);
            $hybrid[] = $result;
        }

        usort($hybrid, fn($a, $b) => $b['score'] <=> $a['score']);
        return array_slice($hybrid, 0, $limit);
    }
}