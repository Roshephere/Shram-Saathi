import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewService } from '../../api/reviewService';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Star, MessageSquare } from 'lucide-react';

const ratingLabels = [
  { key: 'overall', label: 'Overall' },
  { key: 'skill', label: 'Skill' },
  { key: 'timeliness', label: 'Timeliness' },
  { key: 'communication', label: 'Communication' },
];

function StarSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star
            className={`h-5 w-5 ${
              star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ratings, setRatings] = useState({ overall: 0, skill: 0, timeliness: 0, communication: 0 });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['customer-reviews'],
    queryFn: () => reviewService.getAll().then((d) => Array.isArray(d) ? d : []),
  });

  const resetForm = () => {
    setRatings({ overall: 0, skill: 0, timeliness: 0, communication: 0 });
    setComment('');
  };

  const handleSubmit = async () => {
    if (!ratings.overall) {
      toast.error('Please provide an overall rating');
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.create({ ...ratings, comment });
      toast.success('Review submitted');
      setModalOpen(false);
      resetForm();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading reviews..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Star className="h-4 w-4" />
          Write a Review
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <p className="text-sm text-gray-500 text-center">
          Backend endpoint pending — review data is not yet available from the API.
        </p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Reviews you write will appear here."
          icon={MessageSquare}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-700">
                      {review.worker_name?.[0] || 'W'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.worker_name || 'Worker'}</p>
                    <p className="text-xs text-gray-500">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{review.overall || review.rating || 0}</span>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title="Write a Review">
        <div className="space-y-5">
          {ratingLabels.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <StarSelector
                value={ratings[key]}
                onChange={(val) => setRatings((prev) => ({ ...prev, [key]: val }))}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => { setModalOpen(false); resetForm(); }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
