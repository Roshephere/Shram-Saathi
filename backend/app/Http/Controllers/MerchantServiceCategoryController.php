<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\ServiceCategory;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MerchantServiceCategoryController extends Controller
{
    use ApiResponse;

    /**
     * Get all service categories for a merchant
     * GET /merchants/{merchantId}/service-categories
     */
    public function index($merchantId)
    {
        try {
            $merchant = Merchant::findOrFail($merchantId);

            $categories = $merchant->serviceCategories()->get();

            return $this->success(
                $categories,
                'Service categories retrieved successfully',
                200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->error('Merchant not found', 404);
        } catch (\Exception $e) {
            return $this->error('Error retrieving service categories: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Attach service categories to a merchant
     * POST /merchants/{merchantId}/service-categories
     */
    public function attach($merchantId, Request $request)
    {
        try {
            $merchant = Merchant::findOrFail($merchantId);

            $data = $request->validate([
                'service_category_ids' => 'required|array',
                'service_category_ids.*' => 'integer|exists:service_categories,id',
                'base_rate' => 'nullable|numeric|min:0',
                'experience_levels' => 'nullable|string',
            ]);

            // Prepare pivot data
            $attachData = [];
            if (isset($data['base_rate']) || isset($data['experience_levels'])) {
                $attachData = [
                    'base_rate' => $data['base_rate'] ?? null,
                    'experience_levels' => $data['experience_levels'] ?? null,
                ];
            }

            // Attach categories (sync prevents duplicates)
            if (!empty($attachData)) {
                foreach ($data['service_category_ids'] as $categoryId) {
                    $merchant->serviceCategories()->syncWithoutDetaching([
                        $categoryId => $attachData
                    ]);
                }
            } else {
                $merchant->serviceCategories()->syncWithoutDetaching($data['service_category_ids']);
            }

            return $this->success(
                $merchant->serviceCategories()->get(),
                'Service categories attached successfully',
                201
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->error('Merchant not found', 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->error('Error attaching service categories: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Update service category details for a merchant
     * PUT /merchants/{merchantId}/service-categories/{categoryId}
     */
    public function update($merchantId, $categoryId, Request $request)
    {
        try {
            $merchant = Merchant::findOrFail($merchantId);

            // Verify category exists for this merchant
            $exists = $merchant->serviceCategories()
                ->where('service_category_id', $categoryId)
                ->exists();

            if (!$exists) {
                return $this->error('Service category not found for this merchant', 404);
            }

            $data = $request->validate([
                'base_rate' => 'nullable|numeric|min:0',
                'experience_levels' => 'nullable|string',
            ]);

            // Update pivot data
            $merchant->serviceCategories()
                ->syncWithoutDetaching([
                    $categoryId => [
                        'base_rate' => $data['base_rate'] ?? null,
                        'experience_levels' => $data['experience_levels'] ?? null,
                    ]
                ]);

            $category = $merchant->serviceCategories()
                ->where('service_category_id', $categoryId)
                ->first();

            return $this->success(
                $category,
                'Service category updated successfully',
                200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->error('Merchant not found', 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->error('Error updating service category: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Detach a service category from a merchant
     * DELETE /merchants/{merchantId}/service-categories/{categoryId}
     */
    public function detach($merchantId, $categoryId)
    {
        try {
            $merchant = Merchant::findOrFail($merchantId);

            // Verify category exists for this merchant
            $exists = $merchant->serviceCategories()
                ->where('service_category_id', $categoryId)
                ->exists();

            if (!$exists) {
                return $this->error('Service category not found for this merchant', 404);
            }

            // Detach the category
            $merchant->serviceCategories()->detach($categoryId);

            return $this->success(
                null,
                'Service category removed successfully',
                200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->error('Merchant not found', 404);
        } catch (\Exception $e) {
            return $this->error('Error removing service category: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Get all available service categories
     * GET /service-categories
     */
    public function getAvailableCategories()
    {
        try {
            $categories = ServiceCategory::where('is_active', true)
                ->orderBy('name')
                ->get();

            return $this->success(
                $categories,
                'Available service categories retrieved',
                200
            );
        } catch (\Exception $e) {
            return $this->error('Error retrieving categories: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Sync (replace all) service categories for a merchant
     * PUT /merchants/{merchantId}/service-categories/sync
     */
    public function sync($merchantId, Request $request)
    {
        try {
            $merchant = Merchant::findOrFail($merchantId);

            $data = $request->validate([
                'service_category_ids' => 'required|array',
                'service_category_ids.*' => 'integer|exists:service_categories,id',
            ]);

            // Sync replaces all relationships
            $merchant->serviceCategories()->sync($data['service_category_ids']);

            return $this->success(
                $merchant->serviceCategories()->get(),
                'Service categories synchronized successfully',
                200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return $this->error('Merchant not found', 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->error('Error syncing service categories: ' . $e->getMessage(), 400);
        }
    }
}
