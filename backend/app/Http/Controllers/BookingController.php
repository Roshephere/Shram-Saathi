<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Services\BookingService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    use ApiResponse;

    public function __construct(protected BookingService $bookingService)
    {
    }

    /**
     * Merchant creates a bid - POST /bookings
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $merchantId = auth()->user()->merchant->id;

            $booking = $this->bookingService->createBid(
                $validated['service_request_id'],
                $merchantId,
                $validated['proposed_rate'],
                $validated
            );

            return $this->success($booking, 'Bid submitted successfully!', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Get bids for a service request - GET /bookings?service_request_id={id}
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $serviceRequestId = $request->query('service_request_id');
            
            if (!$serviceRequestId) {
                return $this->error('service_request_id parameter required', 400);
            }

            $bids = $this->bookingService->getRequestBids(
                $serviceRequestId,
                $request->only(['status'])
            );

            return $this->success(
                $bids->items(),
                'Bids retrieved successfully',
                200,
                [
                    'pagination' => [
                        'total' => $bids->total(),
                        'per_page' => $bids->perPage(),
                        'current_page' => $bids->currentPage(),
                        'last_page' => $bids->lastPage(),
                    ]
                ]
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Get single booking - GET /bookings/{id}
     */
    public function show(int $id): JsonResponse
    {
        try {
            $booking = $this->bookingService->getBookingById($id);
            $userId = auth()->id();

            if ($booking->customer_id !== $userId && $booking->merchant_id !== auth()->user()->merchant?->id) {
                return $this->error('Unauthorized to view this booking.', 403);
            }

            return $this->success($booking, 'Booking retrieved successfully.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Customer accepts a bid - PUT /bookings/{id}/accept
     */
    public function accept(int $id): JsonResponse
    {
        try {
            $booking = $this->bookingService->acceptBid($id, auth()->id());
            return $this->success($booking, 'Bid accepted! Work will begin shortly.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Merchant starts work - PUT /bookings/{id}/start
     */
    public function start(int $id): JsonResponse
    {
        try {
            $merchant = auth()->user()->merchant;

            if (!$merchant) {
                return $this->error('Only merchants can start work.', 403);
            }

            $booking = $this->bookingService->startWork($id, $merchant->id);
            return $this->success($booking, 'Work started successfully.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Merchant completes work - PUT /bookings/{id}/complete
     */
    public function complete(int $id): JsonResponse
    {
        try {
            $merchant = auth()->user()->merchant;

            if (!$merchant) {
                return $this->error('Only merchants can complete work.', 403);
            }

            $booking = $this->bookingService->completeWork($id, $merchant->id);
            return $this->success($booking, 'Work marked as completed.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Merchant rejects a bid - PUT /bookings/{id}/reject
     */
    public function reject(int $id): JsonResponse
    {
        try {
            $merchant = auth()->user()->merchant;

            if (!$merchant) {
                return $this->error('Only merchants can reject bids.', 403);
            }

            $booking = $this->bookingService->rejectBid($id, $merchant->id);
            return $this->success($booking, 'Bid rejected.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Customer cancels booking - DELETE /bookings/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $booking = $this->bookingService->cancelBooking($id, auth()->id());
            return $this->success($booking, 'Booking cancelled successfully.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Get merchant's bookings - GET /merchant/bookings
     */
    public function merchantBookings(Request $request): JsonResponse
    {
        try {
            $merchant = auth()->user()->merchant;

            if (!$merchant) {
                return $this->error('Only merchants can view their bookings.', 403);
            }

            $bookings = $this->bookingService->getMerchantBookings($merchant->id, $request->only(['status']));

            return $this->success($bookings->items(), 'Merchant bookings retrieved successfully', 200, [
                'pagination' => [
                    'total' => $bookings->total(),
                    'per_page' => $bookings->perPage(),
                    'current_page' => $bookings->currentPage(),
                    'last_page' => $bookings->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Get customer's bookings - GET /customer/bookings
     */
    public function customerBookings(Request $request): JsonResponse
    {
        try {
            $bookings = $this->bookingService->getCustomerBookings(
                auth()->id(),
                $request->only(['status'])
            );

            return $this->success($bookings->items(), 'Your bookings retrieved successfully', 200, [
                'pagination' => [
                    'total' => $bookings->total(),
                    'per_page' => $bookings->perPage(),
                    'current_page' => $bookings->currentPage(),
                    'last_page' => $bookings->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
