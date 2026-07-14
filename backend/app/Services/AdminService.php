<?php

namespace App\Services;

use App\Models\Merchant;
use App\Models\Transaction;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminService
{

    // getting all pending merchant registrations

    public function getPendingMerchantRegistrations()
    {
        return Merchant::where('status', 'pending')->with('user')->latest()->paginate(15);
    }

    public function verifyMerchantRegistration(int $merchantId, int $adminId, string $notes = ''): Merchant
    {
        $merchant = Merchant::findOrFail($merchantId);

        $merchant->update([
            'status' => 'active',
            'verified_at' => now(),
            'verified_by' => $adminId,
            'extras' => array_merge($merchant->extras ?? [], ['admin_notes' => $notes]),
        ]);

        return $merchant;
    }

    /**
     * Reject merchant
     */
    public function rejectMerchant(int $merchantId, string $reason = ''): Merchant
    {
        $merchant = Merchant::findOrFail($merchantId);

        $merchant->update([
            'status' => 'suspended',
            'extras' => array_merge($merchant->extras ?? [], ['rejection_reason' => $reason]),
        ]);

        return $merchant;
    }

    /**
     * bookings - GET /admin/bookings
     */

    public function getAllBookings(array $filters = [])
    {
        $query = \App\Models\Booking::query()->with(['customer', 'merchant', 'serviceRequest']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['merchant_id'])) {
            $query->where('merchant_id', $filters['merchant_id']);
        }

        return $query->latest()->paginate(20);
    }

    /**
     * Suspend merchant
     */
    public function suspendMerchant(int $merchantId, string $reason = ''): Merchant
    {
        $merchant = Merchant::findOrFail($merchantId);

        $merchant->update([
            'status' => 'suspended',
            'extras' => array_merge($merchant->extras ?? [], ['suspension_reason' => $reason]),
        ]);

        return $merchant;
    }

    /**
     * Create transaction from booking
     */
    public function createTransaction(int $bookingId, int $merchantId, float $serviceAmount): Transaction
    {
        $commissionRate = 10; // 10% platform commission
        $commissionAmount = ($serviceAmount * $commissionRate) / 100;
        $merchantAmount = $serviceAmount - $commissionAmount;

        return Transaction::create([
            'booking_id' => $bookingId,
            'merchant_id' => $merchantId,
            'service_amount' => $serviceAmount,
            'commission_rate' => $commissionRate,
            'commission_amount' => $commissionAmount,
            'merchant_amount' => $merchantAmount,
            'status' => 'pending',
        ]);
    }

    /**
     * Complete transaction
     */
    public function completeTransaction(int $transactionId): Transaction
    {
        $transaction = Transaction::findOrFail($transactionId);

        $transaction->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return $transaction;
    }

    /**
     * Get all transactions
     */
    public function getAllTransactions(array $filters = []): LengthAwarePaginator
    {
        $query = Transaction::query()->with(['booking.customer', 'merchant']);
    // dd($query);
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['merchant_id'])) {
            $query->where('merchant_id', $filters['merchant_id']);
        }

        return $query
            ->latest('created_at')
            ->paginate(20);
    }

    /**
     * Dashboard stats
     */
    public function getDashboardStats(): array
    {
        return [
            'total_bookings' => \App\Models\Booking::count(),
            'completed_bookings' => \App\Models\Booking::where('status', 'completed')->count(),
            'total_revenue' => (float) Transaction::where('status', 'completed')->sum('service_amount'),
            'platform_commission' => (float) Transaction::where('status', 'completed')->sum('commission_amount'),
            'pending_transactions' => Transaction::where('status', 'pending')->count(),
            'total_merchants' => Merchant::count(),
            'active_merchants' => Merchant::where('status', 'active')->count(),
            'pending_verifications' => Merchant::where('status', 'pending')->count(),
        ];
    }

    /**
     * Get all reviews
     */
    public function getAllReviews(array $filters = [])
    {
        $query = \App\Models\MerchantReview::query();

        if (!empty($filters['merchant_id'])) {
            $query->where('merchant_id', $filters['merchant_id']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        return $query->with(['user', 'merchant', 'booking'])
            ->latest('created_at')
            ->paginate(20);
    }

    public function resubmitMerchant(int $merchantId)
    {
        try{
            $merchant = Merchant::findOrFail($merchantId);

            if ($merchant->status !== 'suspended') {
                return response()->json(['error' => 'Only suspended merchants can be resubmitted.'], 400);
            }

            $merchant->update([
                'status' => 'pending',
                'extras' => array_merge($merchant->extras ?? [], ['resubmitted_at' => now()]),
            ]);

            return $merchant;
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}