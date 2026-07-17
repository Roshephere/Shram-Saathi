<?php

namespace App\Http\Controllers;

use App\Services\RecommendationService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class RecommendationModelController extends Controller
{
    use ApiResponse;

    public function __construct(protected RecommendationService $recommendationService)
    {}

    /**
     * Get recommended workers for a service request
     * GET /recommendations/service-request/{serviceRequestId}
     */
    public function getForServiceRequest($serviceRequestId, Request $request)
    {
        $maxDistance = $request->query('max_distance', 50); // Default 50km
        $limit = $request->query('limit', 5);

        $recommendations = $this->recommendationService->getRecommendedWorkers(
            $serviceRequestId,
            $limit,
            $maxDistance
        );

        return $this->success(
            $recommendations,
            'Recommended workers retrieved'
        );
    }

    /**
     * Get workers by category, optionally filtered by distance when location provided
     * GET /recommendations/category/{categoryId}
     */
    public function getByCategory($categoryId, Request $request)
    {
        $limit = $request->query('limit', 10);
        $maxDistance = $request->query('max_distance', 50);

        $latitude = $request->query('latitude') ? (float) $request->query('latitude') : null;
        $longitude = $request->query('longitude') ? (float) $request->query('longitude') : null;
    
        $workers = $this->recommendationService->getWorkersByCategory($categoryId, $limit, $latitude, $longitude, $maxDistance);

        return $this->success(
            $workers,
            'Workers retrieved'
        );
    }
}
