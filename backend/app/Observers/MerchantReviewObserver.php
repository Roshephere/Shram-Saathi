<?php

namespace App\Observers;

use App\Models\Merchant;
use App\Models\MerchantReview;

class MerchantReviewObserver
{
    /**
     * Handle the MerchantReview "created" event.
     */
    public function created(MerchantReview $merchantReview): void
    {
        if ($merchantReview->merchant_id) {
            Merchant::find($merchantReview->merchant_id)->updateAvergeRating();
        }

    }

    /**
     * Handle the MerchantReview "updated" event.
     */
    public function updated(MerchantReview $merchantReview): void
    {
        if($merchantReview->merchant_id){
            Merchant::find($merchantReview->merchant_id)->updateAverageRating();
        }
    }

    /**
     * Handle the MerchantReview "deleted" event.
     */
    public function deleted(MerchantReview $merchantReview): void
    {
        if($merchantReview->merchant_id){
            Merchant::find($merchantReview->merchant_id)->updateAverageRating();
        }
    }

    /**
     * Handle the MerchantReview "restored" event.
     */
    public function restored(MerchantReview $merchantReview): void
    {
        if($merchantReview->merchant_id){
            Merchant::find($merchantReview->merchant_id)->updateAverageRating();
        }
    }

    /**
     * Handle the MerchantReview "force deleted" event.
     */
    public function forceDeleted(MerchantReview $merchantReview): void
    {
        //
    }
}
