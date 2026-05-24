<?php

namespace App\Services;
use App\Models\ServiceRequest;
use Illuminate\Pagination\Paginator;

class ServiceRequestService
{


    public function createRequest(int $userId, array $data): ServiceRequest
    {
        $data['user_id'] = $userId;
        $data['status'] = 'open';
        return ServiceRequest::create($data);
    }

    public function getAllRequests(array $filters = []): Paginator
    {
        $query = ServiceRequest::query();

        // category filter
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // status
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // user filter
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        // urgency filter

        if (!empty($filters['urgency'])) {
            $query->where('urgency', $filters['urgency']);
        }
        // budget filter min
        if (!empty($filters['budget_min'])) {
            $query->where('budget_min', '>=', $filters['budget_min']);
        }

        // budget filter max
        if (!empty($filters['budget_max'])) {
            $query->where('budget_max', '<=', $filters['budget_max']);
        }

        // filter by location / distance
        if (!empty($filters['latitude']) && !empty($filters['longitude']) && !empty($filters['distance_km'])) {
            $query->whereBetween('latitude', [
                $filters['latitude'] - ($filters['distance_km'] / 111), // Approx 1 degree latitude ~ 111 km
                $filters['latitude'] + ($filters['distance_km'] / 111)
            ])->whereBetween('longitude', [
                        $filters['longitude'] - ($filters['distance_km'] / (111 * cos(deg2rad($filters['latitude'])))), // Adjust for longitude
                        $filters['longitude'] + ($filters['distance_km'] / (111 * cos(deg2rad($filters['latitude']))))
                    ]);
        }

        return $query->with(['user', 'category', 'userLocation'])
            ->latest('created_at')
            ->paginate(15);
    }

    public function getRequestById(int $requestId): ServiceRequest
    {
        return ServiceRequest::with(['user', 'category', 'userLocation'])->findOrFail($requestId);
    }

    public function getUserRequests(int $userId, array $filters = []): Paginator
    {
        $query = ServiceRequest::where('user_id', $userId);

        // Apply any additional filters if needed
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->with(['category', 'userLocation'])
            ->latest('created_at')
            ->paginate(15);
    }
    // update service request

    public function updateRequest(int $requestId, array $data): ServiceRequest
    {
        $request = ServiceRequest::findOrFail($requestId);
        $request->update($data);
        return $request;
    }

    public function updateStatus(int $requestId, string $status): ServiceRequest
    {
        $request = ServiceRequest::findOrFail($requestId);
        $request->update(['status' => $status]);
        return $request;
    }

    public function cancelRequest(int $requestId):bool{
        $request = ServiceRequest::findOrFail($requestId);
        if($request->status === 'assigned'){
            throw new \Exception('Cannot cancel an assigned request. Complete or reject the booking first.');
        }
        return $request->update(['status' => 'cancelled']) ? true : false;
    }

    public function getOpenRequestByCategory(int $categoryId, int $limit =10): \Illuminate\Database\Eloquent\Collection{
        return ServiceRequest::where('category_id', $categoryId)
        ->where('status', 'open')
        ->with(['user', 'userLocation'])
        ->limit($limit)
        ->get();
    }

    public function deleteRequest(int $requestId): bool
    {
        $request = ServiceRequest::findOrFail($requestId);
        if($request->status !== 'open'){
            throw new \Exception('Only open requests can be deleted. Please cancel the request before deleting.');
        }
        return $request->delete();
    }

}