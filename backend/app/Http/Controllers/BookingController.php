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
        $this->middleware('auth:sanctum');
    }

    /**
     * Create booking - POST /bookings
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $booking = $this->bookingService->createBooking(
                $validated['service_request_id'],
                auth()->id(),
                $validated['merchant_id'],
                $validated['agreed_rate'],
                $validated
            );

            return $this->success($booking, 'Booking created. Worker will be notified.', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Get customer's bookings - GET /bookings
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $bookings = $this->bookingService->getCustomerBookings(auth()->id(), $request->only(['status']));
            
            return $this->success($bookings->items(), 'Bookings retrieved successfully', 200, [
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
     * Get single booking - GET /bookings/{id}
     */
    public function show(int $id): JsonResponse
    {
        try {
            $booking = $this->bookingService->getBookingById($id);
            $userId = auth()->id();

            if ($booking->customer_id !== $userId && $booking->merchant_id !== $userId) {
                return $this->error('Unauthorized to view this booking.', 403);
            }

            return $this->success($booking, 'Booking retrieved successfully.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Worker accepts booking - PUT /bookings/{id}/accept
     */
    public function accept(int $id): JsonResponse
    {
        try {
            $merchant = auth()->user()->merchant;

            if (!$merchant) {
                return $this->error('Only merchants can accept bookings.', 403);
            }

            $booking = $this->bookingService->acceptBooking($id, $merchant->id);
            return $this->success($booking, 'Booking accepted successfully.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Worker rejects booking - PUT /bookings/{id}/reject
     */
    public function reject(int $id): JsonResponse
    {
        try {
            $merchant = auth()->user()->merchant;

            if (!$merchant) {
                return $this->error('Only merchants can reject bookings.', 403);
            }

            $booking = $this->bookingService->rejectBooking($id, $merchant->id);
            return $this->success($booking, 'Booking rejected successfully.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Worker completes booking - PUT /bookings/{id}/complete
     */
    public function complete(int $id): JsonResponse
    {
        try {
            $merchant = auth()->user()->merchant;

            if (!$merchant) {
                return $this->error('Only merchants can complete bookings.', 403);
            }

            $booking = $this->bookingService->completeBooking($id, $merchant->id);
            return $this->success($booking, 'Booking marked as completed.', 200);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Cancel booking (customer) - DELETE /bookings/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->bookingService->cancelBooking($id, auth()->id());
            return $this->success(null, 'Booking cancelled successfully.', 200);
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
}
