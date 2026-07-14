import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { merchantService } from '../../api/merchantService';
import { reviewService } from '../../api/reviewService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { Star } from 'lucide-react';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const merchants = await merchantService.getAll();
      const list = Array.isArray(merchants) ? merchants : [];
      const myMerchant = list.find((m) => m.user_id === user?.id);
      setMerchant(myMerchant || null);

      if (myMerchant) {
        const result = await reviewService.getByMerchant(myMerchant.id);
        const items = result?.data ?? result;
        setReviews(Array.isArray(items) ? items : []);
      }
    } catch {
      setError('Failed to load reviews');
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner text="Loading reviews..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  const avgRating = merchant?.avg_rating ? Number(merchant.avg_rating) : 0;
  const reviewCount = reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating_overall || r.rating || 0) === star).length;
    return { star, count, pct: reviewCount > 0 ? (count / reviewCount) * 100 : 0 };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>

      <div className="bg-white rounded-xl border p-6 flex items-center gap-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}</p>
          {avgRating > 0 && <StarRating rating={Math.round(avgRating)} />}
          <p className="text-sm text-gray-500 mt-1">{reviewCount} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {ratingDistribution.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-8 text-gray-500 text-right">{star}</span>
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-6 text-gray-400 text-xs">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Reviews from customers will appear here once jobs are completed." icon={Star} />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{review.user?.name || 'Customer'}</span>
                    <StarRating rating={Math.round(review.rating_overall || 0)} />
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    {review.rating_skill && <span>Skill: {review.rating_skill}</span>}
                    {review.rating_timeliness && <span>Timeliness: {review.rating_timeliness}</span>}
                    {review.rating_communication && <span>Communication: {review.rating_communication}</span>}
                  </div>
                  {review.review_text && <p className="mt-2 text-sm text-gray-600">{review.review_text}</p>}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
