<?php

namespace App\Services;
use App\Models\Booking;
use App\Models\ServiceRequest;
use Illuminate\Pagination\Paginator;

class BookingService
{
    public function createBooking(int $serviceRequestId, int $customerId, int $mechantId, float $agreedRate, array $data = [])
    {

        // validing if the service request exists and belongs to customer

        $request = ServiceRequest::findOrFail($serviceRequestId)->where('customer_id', $customerId);

        // validating agreed rate is within the budget range

        if ($agreedRate < $request->budget_min || $agreedRate > $request->budget_max) {
            throw new \InvalidArgumentException('Agreed rate must be within the budget range');
        }
        // checking if booking already exists for the service request
        if (Booking::where('service_request_id', $serviceRequestId)->exists()) {
            throw new \InvalidArgumentException('Booking already exists for this service request');
        }

        // verifying merchant is eligible to accept the service request (e.g. has the required skills, is active, etc.)
        $merchant = $request->category->merchants()->findOrFail($mechantId);

        $booking = Booking::create([
            'service_request_id' => $serviceRequestId,
            'customer_id' => $customerId,
            'merchant_id' => $mechantId,
            'status' => 'pending',
            'agreed_rate' => $agreedRate,
            'special_notes' => $data['special_notes'] ?? null,
            'scheduled_at' => $data['scheduled_at'] ?? null,
        ]);

        $request->update(['status' => 'assigned']);
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
     * Get customer's bookings
     */
    public function getCustomerBookings(int $customerId, array $filters = []): Paginator
    {
        $query = Booking::where('customer_id', $customerId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->with(['merchant', 'serviceRequest'])
            ->latest('created_at')
            ->paginate(15);
    }

    /**
     * Get merchant's bookings
     */
    public function getMerchantBookings(int $merchantId, array $filters = []): Paginator
    {
        $query = Booking::where('merchant_id', $merchantId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->with(['customer', 'serviceRequest'])
            ->latest('created_at')
            ->paginate(15);
    }

    /**
     * Accept booking (worker accepts job at agreed rate)
     */
    public function acceptBooking(int $bookingId, int $merchantId): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        if ($booking->merchant_id !== $merchantId) {
            throw new \Exception('Unauthorized.');
        }

        if (!$booking->isPending()) {
            throw new \Exception('Can only accept pending bookings.');
        }

        $booking->update(['status' => 'accepted', 'started_at' => now()]);

        return $booking->load(['customer', 'serviceRequest']);
    }

    /**
     * Reject booking (worker declines the job)
     */
    public function rejectBooking(int $bookingId, int $merchantId): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        if ($booking->merchant_id !== $merchantId) {
            throw new \Exception('Unauthorized.');
        }

        if (!$booking->isPending()) {
            throw new \Exception('Can only reject pending bookings.');
        }

        $booking->update(['status' => 'rejected']);
        $booking->serviceRequest->update(['status' => 'open']);

        return $booking;
    }

    /**
     * Complete booking (job is done, ready for payment)
     */
    public function completeBooking(int $bookingId, int $merchantId): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        if ($booking->merchant_id !== $merchantId) {
            throw new \Exception('Unauthorized.');
        }

        if (!$booking->isAccepted()) {
            throw new \Exception('Can only complete accepted bookings.');
        }

        $booking->update(['status' => 'completed', 'completed_at' => now()]);
        $booking->serviceRequest->update(['status' => 'completed']);

        return $booking->load(['customer', 'serviceRequest']);
    }

    /**
     * Cancel booking (customer cancels)
     */
    public function cancelBooking(int $bookingId, int $customerId): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        if ($booking->customer_id !== $customerId) {
            throw new \Exception('Unauthorized.');
        }

        if ($booking->isCompleted()) {
            throw new \Exception('Cannot cancel completed bookings.');
        }

        $booking->update(['status' => 'cancelled']);

        if (!$booking->isRejected()) {
            $booking->serviceRequest->update(['status' => 'open']);
        }

        return $booking;
    }
}
