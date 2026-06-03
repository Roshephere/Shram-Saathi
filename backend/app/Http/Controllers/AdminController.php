<?php

namespace App\Http\Controllers;

use App\Services\AdminService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    use ApiResponse;

    public function __construct(protected AdminService $adminService)
    {
    }

    /**
     * Get pending merchants - GET /admin/merchants/pending
     */
    public function getPendingMerchants(): JsonResponse
    {
        try {
            $merchants = $this->adminService->getPendingMerchantRegistrations();

            return $this->success(
                $merchants->items(),
                'Pending merchants retrieved',
                200,
                [
                    'pagination' => [
                        'total' => $merchants->total(),
                        'per_page' => $merchants->perPage(),
                        'current_page' => $merchants->currentPage(),
                        'last_page' => $merchants->lastPage(),
                    ]
                ]
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Verify merchant - PUT /admin/merchants/{merchantId}/verify
     */
    public function verifyMerchant(int $merchantId, Request $request): JsonResponse
    {
        try {
            $merchant = $this->adminService->verifyMerchantRegistration(
                $merchantId,
                auth()->id(),
                $request->input('notes', '')
            );

            return $this->success($merchant, 'Merchant verified successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Reject merchant - PUT /admin/merchants/{merchantId}/reject
     */
    public function rejectMerchant(int $merchantId, Request $request): JsonResponse
    {
        try {
            $merchant = $this->adminService->rejectMerchant(
                $merchantId,
                $request->input('reason', '')
            );

            return $this->success($merchant, 'Merchant rejected');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Suspend merchant - PUT /admin/merchants/{merchantId}/suspend
     */
    public function suspendMerchant(int $merchantId, Request $request): JsonResponse
    {
        try {
            $merchant = $this->adminService->suspendMerchant(
                $merchantId,
                $request->input('reason', '')
            );

            return $this->success($merchant, 'Merchant suspended');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Get all transactions - GET /admin/transactions
     */
    public function getTransactions(Request $request): JsonResponse
    {
        try {
            $transactions = $this->adminService->getAllTransactions($request->only(['status', 'merchant_id']));

            return $this->success(
                $transactions->items(),
                'Transactions retrieved',
                200,
                [
                    'pagination' => [
                        'total' => $transactions->total(),
                        'per_page' => $transactions->perPage(),
                        'current_page' => $transactions->currentPage(),
                        'last_page' => $transactions->lastPage(),
                    ]
                ]
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Dashboard stats - GET /admin/dashboard
     */
    public function getDashboard(): JsonResponse
    {
        try {
            $stats = $this->adminService->getDashboardStats();
            return $this->success($stats, 'Dashboard stats retrieved');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
