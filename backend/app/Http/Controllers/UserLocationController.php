<?php

namespace App\Http\Controllers;

use App\Services\UserLocationService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class UserLocationController extends Controller
{
    use ApiResponse;

    public function __construct(protected UserLocationService $locationService)
    {}

    /**
     * Get all user locations
     * GET /user/locations
     */
    public function index(Request $request)
    {
        $locations = $this->locationService->getUserLocations($request->user()->id);

        return $this->success(
            $locations,
            'User locations retrieved',
            200
        );
    }

    /**
     * Add location to user
     * POST /user/locations
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'is_primary' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $location = $this->locationService->addLocation($request->user()->id, $data);

        return $this->success(
            $location,
            'Location added successfully',
            201
        );
    }

    /**
     * Update user location
     * PUT /user/locations/{locationId}
     */
    public function update(Request $request, $locationId)
    {
        $data = $request->validate([
            'label' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'is_primary' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
        ]);

        $location = $this->locationService->updateLocation($locationId, $data);

        return $this->success(
            $location,
            'Location updated successfully'
        );
    }

    /**
     * Delete location
     * DELETE /user/locations/{locationId}
     */
    public function destroy($locationId)
    {
        $location = \App\Models\UserLocation::findOrFail($locationId);
        $location->delete();

        return $this->success(
            null,
            'Location deleted successfully'
        );
    }
}
