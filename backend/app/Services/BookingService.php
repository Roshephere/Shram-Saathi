<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\ServiceRequest;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class BookingService
{
    /**
     * Merchant creates a bid on a service request
     * POST /api/bookings - merchant submits bid
     */
    public function createBid(int $serviceRequestId, int $merchantId, float $proposedRate, array $data = []): Booking
    {
        // Verify service request exists and is open
        $request = ServiceRequest::findOrFail($serviceRequestId);

        if ($request->status !== 'open') {
            throw new \Exception('Service request is no longer open for bidding');
        }

        // Validate proposed rate is within budget range
        if ($proposedRate < $request->budget_min || $proposedRate > $request->budget_max) {
            throw new \InvalidArgumentException(
                "Proposed rate must be between {$request->budget_min} and {$request->budget_max}"
            );
        }

        // Check if merchant already bid on this request
        if (Booking::where('service_request_id', $serviceRequestId)
            ->where('merchant_id', $merchantId)
            ->whereIn('status', ['bidding', 'accepted'])
            ->exists()) {
            throw new \Exception('You already have an active bid on this request');
        }

        // Create booking as bid
        $booking = Booking::create([
            'service_request_id' => $serviceRequestId,
            'customer_id' => $request->user_id,
            'merchant_id' => $merchantId,
            'status' => 'bidding',
            'agreed_rate' => $proposedRate,
            'special_notes' => $data['message'] ?? null,
            'scheduled_at' => $data['scheduled_at'] ?? null,
        ]);

        return $booking->load(['customer', 'merchant', 'serviceRequest']);
    }

    /**
     * Get booking by ID
     */
    public function getBookingById(int $bookingId): Booking
    {
        return Booking::with(['customer', 'merchant', 'serviceRequest'])->findOrFail($bookingId);
    }

    /**
     * Get all bids for a service request (customer selecting from bids)
     */
    public function getRequestBids(int $serviceRequestId, array $filters = []): LengthAwarePaginator
    {
        $query = Booking::where('service_request_id', $serviceRequestId)
            ->whereIn('status', ['bidding', 'accepted']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->with(['merchant', 'serviceRequest'])
            ->orderBy('status', 'asc') // bidding first, then accepted
            ->latest('created_at')
            ->paginate(15);
    }

    /**
     * Get customer's active jobs (accepted/in_progress/completed)
     */
    public function getCustomerBookings(int $customerId, array $filters = []): LengthAwarePaginator
    {
        $query = Booking::where('customer_id', $customerId)
            ->whereIn('status', ['accepted', 'in_progress', 'completed']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->with(['merchant', 'serviceRequest'])
            ->latest('created_at')
            ->paginate(15);
    }

    /**
     * Get merchant's bids and jobs
     */
    public function getMerchantBookings(int $merchantId, array $filters = []): LengthAwarePaginator
    {
        $query = Booking::where('merchant_id', $merchantId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            // Default: show active bids and jobs
            $query->whereIn('status', ['bidding', 'accepted', 'in_progress']);
        }

        return $query->with(['customer', 'serviceRequest'])
            ->latest('created_at')
            ->paginate(15);
    }

    /**
     * Customer accepts a bid (selects this merchant)
     * PUT /api/bookings/{id}/accept - customer selects winner
     */
    public function acceptBid(int $bookingId, int $customerId): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        if ($booking->customer_id !== $customerId) {
            throw new \Exception('Unauthorized.');
        }

        if ($booking->status !== 'bidding') {
            throw new \Exception('Can only accept bids with "bidding" status.');
        }

        DB::beginTransaction();
        try {
            // Accept this bid
            $booking->update(['status' => 'accepted', 'started_at' => now()]);

            // Reject all other bids for this request
            Booking::where('service_request_id', $booking->service_request_id)
                ->where('id', '!=', $bookingId)
                ->where('status', 'bidding')
                ->update(['status' => 'rejected']);

            // Update service request status
            $booking->serviceRequest->update(['status' => 'assigned']);

            DB::commit();

            return $booking->load(['customer', 'serviceRequest']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Merchant starts the work after customer accepts
     * PUT /api/bookings/{id}/start - merchant begins work
     */
    public function startWork(int $bookingId, int $merchantId): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        if ($booking->merchant_id !== $merchantId) {
            throw new \Exception('Unauthorized.');
        }

        if ($booking->status !== 'accepted') {
            throw new \Exception('Can only start work on accepted bookings.');
        }

        $booking->update(['status' => 'in_progress']);

        return $booking->load(['customer', 'serviceRequest']);
    }

    /**
     * Merchant marks work as complete
     * PUT /api/bookings/{id}/complete - merchant completes work
     */
    public function completeWork(int $bookingId, int $merchantId): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        if ($booking->merchant_id !== $merchantId) {
            throw new \Exception('Unauthorized.');
        }

        if ($booking->status !== 'in_progress') {
            throw new \Exception('Can only complete in-progress bookings.');
        }

        $booking->update(['status' => 'completed', 'completed_at' => now()]);
        $booking->serviceRequest->update(['status' => 'completed']);

        // Create transaction for platform commission tracking
        if ($booking->agreed_rate > 0) {
            $adminService = new \App\Services\AdminService();
            $adminService->createTransaction(
                $booking->id,
                $booking->merchant_id,
                (float) $booking->agreed_rate
            );
        }

        return $booking->load(['customer', 'serviceRequest']);
    }

    /**
     * Merchant rejects a bid
     */
    public function rejectBid(int $bookingId, int $merchantId): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        if ($booking->merchant_id !== $merchantId) {
            throw new \Exception('Unauthorized.');
        }

        if ($booking->status !== 'bidding') {
            throw new \Exception('Can only reject bids with "bidding" status.');
        }

        $booking->update(['status' => 'rejected']);

        return $booking;
    }

    /**
     * Customer cancels an accepted booking
     */
    public function cancelBooking(int $bookingId, int $customerId): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        if ($booking->customer_id !== $customerId) {
            throw new \Exception('Unauthorized.');
        }

        if ($booking->status === 'completed') {
            throw new \Exception('Cannot cancel completed bookings.');
        }

        if ($booking->status === 'rejected') {
            throw new \Exception('Booking already rejected.');
        }

        $booking->update(['status' => 'cancelled']);

        // Reopen the service request if it was assigned
        if ($booking->serviceRequest->status === 'assigned') {
            $booking->serviceRequest->update(['status' => 'open']);
        }

        return $booking;
    }
}
