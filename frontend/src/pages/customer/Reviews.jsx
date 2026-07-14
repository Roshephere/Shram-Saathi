import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewService } from '../../api/reviewService';
import { bookingService } from '../../api/bookingService';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Star, MessageSquare } from 'lucide-react';

function StarSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} className="p-0.5">
          <Star className={`h-6 w-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  const [searchParams] = useSearchParams();
  const bookingIdParam = searchParams.get('booking');
  const [modalOpen, setModalOpen] = useState(!!bookingIdParam);
  const [editingReview, setEditingReview] = useState(null);
  const [bookingToReview, setBookingToReview] = useState(null);
  const [ratings, setRatings] = useState({ overall: 0, skill: 0, timeliness: 0, communication: 0 });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bookingIdParam) {
      bookingService.getById(bookingIdParam).then((b) => {
        setBookingToReview(b);
        if (b?.review) {
          setEditingReview(b.review);
          setRatings({
            overall: b.review.rating_overall || 0,
            skill: b.review.rating_skill || 0,
            timeliness: b.review.rating_timeliness || 0,
            communication: b.review.rating_communication || 0,
          });
          setComment(b.review.review_text || '');
        }
      }).catch(() => {});
    }
  }, [bookingIdParam]);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['customer-reviews'],
    queryFn: () => reviewService.getMyReviews().then((d) => Array.isArray(d) ? d : []),
  });

  const resetForm = () => {
    setRatings({ overall: 0, skill: 0, timeliness: 0, communication: 0 });
    setComment('');
    setEditingReview(null);
    setBookingToReview(null);
  };

  const handleSubmit = async () => {
    if (!ratings.overall) {
      toast.error('Please provide an overall rating');
      return;
    }
    if (!bookingIdParam) {
      toast.error('No booking selected');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        booking_id: Number(bookingIdParam),
        rating_overall: ratings.overall,
        rating_skill: ratings.skill || null,
        rating_timeliness: ratings.timeliness || null,
        rating_communication: ratings.communication || null,
        review_text: comment || null,
      };

      if (editingReview) {
        await reviewService.update(editingReview.id, payload);
        toast.success('Review updated');
      } else {
        await reviewService.create(payload);
        toast.success('Review submitted');
      }
      setModalOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading reviews..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        {bookingIdParam && (
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Star className="h-4 w-4" /> Write a Review
          </button>
        )}
      </div>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Reviews from completed bookings will appear here." icon={MessageSquare} />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-700">
                      {review.merchant?.business_name?.[0] || 'W'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.merchant?.business_name || 'Worker'}</p>
                    <p className="text-xs text-gray-500">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{review.rating_overall}</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                {review.rating_skill && <span>Skill: {review.rating_skill}</span>}
                {review.rating_timeliness && <span>Timeliness: {review.rating_timeliness}</span>}
                {review.rating_communication && <span>Communication: {review.rating_communication}</span>}
              </div>
              {review.review_text && <p className="text-sm text-gray-600">{review.review_text}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingReview ? 'Edit Review' : 'Write a Review'}>
        <div className="space-y-5">
          {bookingToReview && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-gray-900">{bookingToReview.service_request?.title || `Booking #${bookingToReview.id}`}</p>
              <p className="text-gray-500">NPR {Number(bookingToReview.agreed_rate).toLocaleString()}</p>
            </div>
          )}

          {[
            { key: 'overall', label: 'Overall *' },
            { key: 'skill', label: 'Skill' },
            { key: 'timeliness', label: 'Timeliness' },
            { key: 'communication', label: 'Communication' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <StarSelector value={ratings[key]} onChange={(val) => setRatings((prev) => ({ ...prev, [key]: val }))} />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} maxLength={500}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Share your experience..." />
            <p className="text-xs text-gray-400 mt-1">{comment.length}/500</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setModalOpen(false); resetForm(); }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
