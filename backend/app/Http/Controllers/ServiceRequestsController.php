<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequestRequest;
use App\Http\Requests\UpdateServiceRequestRequest;
use App\Models\ServiceRequests;
use App\Models\UserLocation;
use App\Services\ServiceRequestService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceRequestsController extends Controller
{

    use ApiResponse;

    protected ServiceRequestService $serviceRequestService;

    public function __construct(ServiceRequestService $serviceRequestService)
    {
        $this->serviceRequestService = $serviceRequestService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $filters = $request->only([
                'status',
                'category_id',
                'urgency',
                'budget_min',
                'budget_max',
                'latitude',
                'longitude',
                'distance_km',
            ]);

            // Regular users see only their own requests
            // Admins see all requests
            if (!auth()->user()->hasRole('admin')) {
                $filters['user_id'] = auth()->id();
            }

            $requests = $this->serviceRequestService->getAllRequests($filters);

            return $this->success(
                $requests,
                'Service requests retrieved successfully.',
                200,
                [
                    'pagination' => [
                        'total' => $requests->total(),
                        'per_page' => $requests->perPage(),
                        'current_page' => $requests->currentPage(),
                        'last_page' => $requests->lastPage(),
                    ]
                ]
            );
        } catch (\Exception $e) {
            return $this->error('Error retrieving service requests: ' . $e->getMessage(), 400);
        }
    }


    /**
     * Store a newly created service request
     */
    public function store(StoreServiceRequestRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            $validated = $request->validated();
            // If custom lat/long provided, use those. Otherwise fetch from user_location_id
            if (empty($validated['latitude']) || empty($validated['longitude'])) {
                $location = UserLocation::findOrFail($validated['user_location_id']);
                $validated['latitude'] = $location->latitude;
                $validated['longitude'] = $location->longitude;
            }

            $serviceRequest = $this->serviceRequestService->createRequest(
                $userId,
                $validated
            );

            return $this->success(
                $serviceRequest->load(['user', 'category', 'userLocation']),
                'Service request created successfully',
                201
            );
        } catch (\Exception $e) {
            Log::error('Failed to create service request', ['error' => $e->getMessage()]);
            return $this->error('Failed to create service request', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified service request
     */
    public function show(int $id): JsonResponse
    {
        try {
            $serviceRequest = $this->serviceRequestService->getRequestById($id);

            return $this->success(
                $serviceRequest,
                'Service request retrieved successfully',
                200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->error('Service request not found', 404);
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve service request', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified service request
     */
    public function update(UpdateServiceRequestRequest $request, int $id): JsonResponse
    {
        try {
            $serviceRequest = ServiceRequests::findOrFail($id);

            // Check authorization
            if ($serviceRequest->user_id !== auth()->id()) {
                return $this->error('Unauthorized to update this request', 403);
            }

            $updated = $this->serviceRequestService->updateRequest($id, $request->validated());

            return $this->success(
                $updated->load(['user', 'category', 'userLocation']),
                'Service request updated successfully',
                200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->error('Service request not found', 404);
        } catch (\Exception $e) {
            return $this->error('Failed to update service request', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete/Cancel the specified service request
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $serviceRequest = ServiceRequests::findOrFail($id);

            // Check authorization
            if ($serviceRequest->user_id !== auth()->id()) {
                return $this->error('Unauthorized to cancel this request', 403);
            }

            $this->serviceRequestService->cancelRequest($id);

            return $this->success(
                null,
                'Service request cancelled successfully',
                200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->error('Service request not found', 404);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Get authenticated user's service requests
     */
    public function userRequests(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status']);
            $userId = auth()->id();

            $requests = $this->serviceRequestService->getUserRequests($userId, $filters);

            return $this->success(
                $requests->items(),
                'User service requests retrieved successfully',
                200,
                [
                    'pagination' => [
                        'total' => $requests->total(),
                        'per_page' => $requests->perPage(),
                        'current_page' => $requests->currentPage(),
                        'last_page' => $requests->lastPage(),
                    ]
                ]
            );
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve user requests', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get open service requests available for merchants to bid on
     */
    public function availableRequests(Request $request): JsonResponse
    {
        try {
            $merchantId = auth()->id();
            
            $filters = $request->only([
                'category_id',
                'urgency',
                'budget_min',
                'budget_max',
                'distance_km',
            ]);
            
            // Add status filter for open requests only
            $filters['status'] = 'open';
            
            // Exclude merchant's own requests
            $filters['exclude_user_id'] = $merchantId;
            
            $requests = $this->serviceRequestService->getAllRequests($filters);

            return $this->success(
                $requests->items(),
                'Available service requests retrieved successfully',
                200,
                [
                    'pagination' => [
                        'total' => $requests->total(),
                        'per_page' => $requests->perPage(),
                        'current_page' => $requests->currentPage(),
                        'last_page' => $requests->lastPage(),
                    ]
                ]
            );
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve available requests', 500, ['error' => $e->getMessage()]);
        }
    }
}

