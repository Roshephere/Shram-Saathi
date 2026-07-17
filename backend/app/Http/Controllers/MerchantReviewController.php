<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\MerchantReviewResource;
use App\Models\Booking;
use App\Models\Merchant;
use App\Models\MerchantReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MerchantReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($merchantId)
    {
        // Support 'me' to get current user's merchant reviews
        if ($merchantId === 'me') {
            $merchant = auth()->user()->merchant;
            if (!$merchant) {
                return $this->error('No merchant profile found.', 404);
            }
            $merchantId = $merchant->id;
        } else {
            $merchant = Merchant::findOrFail((int) $merchantId);
        }

        $reviews = MerchantReview::where('merchant_id', $merchantId)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success(
            MerchantReviewResource::collection($reviews),
            $reviews->isEmpty() ? 'No reviews found.' : 'Reviews retrieved successfully.'
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        try {
            $validated = $request->validated();
            $userId = auth()->id();

            $booking = Booking::with('serviceRequest')->findOrFail($validated['booking_id']);

            if ($booking->customer_id !== $userId) {
                return $this->error('You can only review your own bookings.', 403);
            }
            if ($booking->status !== 'completed') {
                return $this->error('You can only review completed bookings.', 400);
            }

            // check if already available
            $existingReview = MerchantReview::where('service_request_id', $booking->service_request_id)->where('user_id', $userId)->exists();
            if ($existingReview) {
                return $this->error('You have already reviewed this booking.', 422);
            }

            $review = MerchantReview::create([
                'merchant_id' => $booking->merchant_id,
                'user_id' => $userId,
                'service_request_id' => $booking->service_request_id,
                'rating_overall' => $validated['rating_overall'],
                'rating_skill' => $validated['rating_skill'] ?? null,
                'rating_timeliness' => $validated['rating_timeliness'] ?? null,
                'rating_communication' => $validated['rating_communication'] ?? null,
                'review_text' => $validated['review_text'] ?? null,
                'is_verified' => true,
            ]);

            try {

                $merchant = Merchant::find($booking->merchant_id);
                if ($merchant) {
                    $merchant->updateAverageRating();
                }
            } catch (\Exception $e) {
                Log::info('Error updating merchant average rating: ' . $e->getMessage());
                return $this->error('An error occurred while updating the merchant average rating.', 500);
            }
            return $this->success(
                new MerchantReviewResource($review->load(['user', 'merchant'])),
                'Review submitted successfully.',
                201
            );
        } catch (\Exception $e) {
            Log::info('Error submitting review: ' . $e->getMessage());
            return $this->error('An error occurred while submitting the review.', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MerchantReview $merchantReview)
    {
        return $this->success(new MerchantReviewResource($merchantReview->load(['user', 'merchant', 'booking'])), 'Review obtained successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MerchantReview $merchantReview)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MerchantReview $merchantReview)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MerchantReview $merchantReview)
    {
        try {
            $review = $merchantReview;
            $userId = auth()->id();
            $isAdmin = auth()->user()->hasRole('admin');

            if ($review->user_id !== $userId && !$isAdmin) {
                return $this->error('You can only delete your own reviews.', 403);
            }

            $merchantId = $review->merchant_id;
            $review->delete();

            $merchant = Merchant::find($merchantId);
            if ($merchant) {
                $merchant->updateAverageRating();
            }
            return $this->success(null, 'Review deleted successfully.');
        } catch (\Exception $e) {
            return $this->error('An error occurred while deleting the review.', 500);
        }
    }
}
