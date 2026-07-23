<?php

namespace App\Services;

use App\Models\Merchant;
use App\Models\MerchantReview;

class CollaborativeFilteringService
{
    private array $ratingMatrix = [];
    private array $merchantSimCache = [];
    private bool $built = false;

    /**
     * Build the user-merchant rating matrix from verified reviews
     * Structure: [user_id][merchant_id] = rating_overall
     */
    public function buildMatrix(): void
    {
        $reviews = MerchantReview::where('is_verified', true)
            ->whereNotNull('rating_overall')
            ->get(['user_id', 'merchant_id', 'rating_overall']);

        $this->ratingMatrix = [];

        foreach ($reviews as $review) {
            $this->ratingMatrix[$review->user_id][$review->merchant_id] = (float) $review->rating_overall;
        }

        $this->built = true;
        $this->merchantSimCache = [];
    }

    /**
     * Calculate Pearson Correlation Coefficient between two merchants
     * based on ratings from users who rated both
     */
    private function pearsonCorrelation(int $merchantA, int $merchantB): float
    {
        $commonUsers = [];
        foreach ($this->ratingMatrix as $userId => $ratings) {
            if (isset($ratings[$merchantA]) && isset($ratings[$merchantB])) {
                $commonUsers[] = $userId;
            }
        }

        $n = count($commonUsers);
        if ($n < 2) return 0.0;

        $sumA = 0;
        $sumB = 0;
        $sumASq = 0;
        $sumBSq = 0;
        $sumAB = 0;

        foreach ($commonUsers as $userId) {
            $ratingA = $this->ratingMatrix[$userId][$merchantA];
            $ratingB = $this->ratingMatrix[$userId][$merchantB];

            $sumA += $ratingA;
            $sumB += $ratingB;
            $sumASq += $ratingA * $ratingA;
            $sumBSq += $ratingB * $ratingB;
            $sumAB += $ratingA * $ratingB;
        }

        $numerator = $sumAB - ($sumA * $sumB / $n);
        $denominator = sqrt(
            ($sumASq - ($sumA * $sumA / $n)) *
            ($sumBSq - ($sumB * $sumB / $n))
        );

        return $denominator == 0 ? 0.0 : $numerator / $denominator;
    }

    /**
     * Get similar merchants to a given merchant (item-based)
     * Returns [merchant_id => pearson_r] sorted descending
     */
    public function getSimilarMerchants(int $merchantId, int $limit = 10): array
    {
        if (!$this->built) $this->buildMatrix();

        $similar = [];
        foreach ($this->ratingMatrix as $userId => $ratings) {
            foreach ($ratings as $otherMerchantId => $rating) {
                if ($otherMerchantId === $merchantId) continue;

                $pairKey = min($merchantId, $otherMerchantId) . '-' . max($merchantId, $otherMerchantId);
                if (!isset($this->merchantSimCache[$pairKey])) {
                    $this->merchantSimCache[$pairKey] = $this->pearsonCorrelation($merchantId, $otherMerchantId);
                }

                $r = $this->merchantSimCache[$pairKey];
                if ($r > 0) {
                    if (!isset($similar[$otherMerchantId])) {
                        $similar[$otherMerchantId] = $r;
                    } else {
                        $similar[$otherMerchantId] = max($similar[$otherMerchantId], $r);
                    }
                }
            }
        }

        arsort($similar);
        return array_slice($similar, 0, $limit);
    }

    /**
     * Predict rating for a (user, merchant) pair using item-based CF
     * Uses weighted average of similar merchants' ratings from this user
     */
    public function predictRating(int $userId, int $merchantId): float
    {
        if (!$this->built) $this->buildMatrix();

        if (!isset($this->ratingMatrix[$userId])) return 0.0;

        $userRatings = $this->ratingMatrix[$userId];
        if (isset($userRatings[$merchantId])) return $userRatings[$merchantId];

        $simMerchants = $this->getSimilarMerchants($merchantId, 20);

        $weightedSum = 0;
        $similaritySum = 0;

        foreach ($simMerchants as $otherId => $sim) {
            if (isset($userRatings[$otherId])) {
                $weightedSum += $sim * $userRatings[$otherId];
                $similaritySum += abs($sim);
            }
        }

        return $similaritySum > 0 ? $weightedSum / $similaritySum : 0;
    }

    /**
     * Get collaborative filtering recommendations for a user in a category
     * Returns [merchant_id => predicted_rating] sorted descending
     */
    public function getRecommendationsForUser(int $userId, ?int $categoryId = null, int $limit = 10): array
    {
        if (!$this->built) $this->buildMatrix();

        $query = Merchant::where('status', 'active');
        if ($categoryId) {
            $query->whereHas('serviceCategories', fn($q) => $q->where('service_category_id', $categoryId));
        }
        $candidates = $query->pluck('id')->toArray();

        $userHasRated = array_keys($this->ratingMatrix[$userId] ?? []);

        $predictions = [];
        foreach ($candidates as $merchantId) {
            if (in_array($merchantId, $userHasRated)) continue;

            $predicted = $this->predictRating($userId, $merchantId);
            if ($predicted > 0) {
                $predictions[$merchantId] = round($predicted, 4);
            }
        }

        arsort($predictions);
        return array_slice($predictions, 0, $limit);
    }
}
