import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import DataTable from '../../components/ui/DataTable';
import { Star, MessageSquare, Check, X, Eye, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [viewReview, setViewReview] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.getReviews();
      const list = Array.isArray(result?.data) ? result.data : [];
      const rows = list
        .filter((review) =>
          review.rating_overall !== null &&
          review.rating_overall !== undefined
        )
        .map((review) => ({
          id: review.id,
          merchant_id: review.merchant_id,
          business_name:
            review.merchant?.business_name ??
            `Merchant #${review.merchant_id}`,
          avg_rating: Number(review.rating_overall),
          rating_skill: review.rating_skill ? Number(review.rating_skill) : null,
          rating_timeliness: review.rating_timeliness ? Number(review.rating_timeliness) : null,
          rating_communication: review.rating_communication ? Number(review.rating_communication) : null,
          review_text: review.review_text ?? '',
          customer_name: review.user?.name ?? 'Unknown customer',
          status: review.is_verified ? 'verified' : 'unverified',
          raw: review,
        }));
      setReviews(rows);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError('Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (review) => {
    setActionLoading(review.id);
    try {
      await adminService.verifyReview(review.id);
      toast.success('Review verified');
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, status: 'verified' } : r
        )
      );
    } catch {
      toast.error('Failed to verify review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (review) => {
    setActionLoading(review.id);
    try {
      await adminService.rejectReview(review.id);
      toast.success('Review rejected');
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, status: 'unverified' } : r
        )
      );
    } catch {
      toast.error('Failed to reject review');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'business_name', label: 'Merchant' },
    { key: 'customer_name', label: 'Customer' },
    {
      key: 'avg_rating', label: 'Rating',
      render: (row) => {
        const rating = Number(row.avg_rating);
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">
              {Number.isFinite(rating) ? rating.toFixed(1) : 'N/A'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'review_text', label: 'Review',
      render: (row) => (
        <span className="text-sm text-gray-600 line-clamp-2 max-w-[200px] block">
          {row.review_text || <em className="text-gray-400">No comment</em>}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewReview(row)}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status === 'unverified' ? (
            <button
              onClick={() => handleVerify(row)}
              disabled={actionLoading === row.id}
              className="p-1.5 text-green-500 hover:text-green-700 rounded-lg hover:bg-green-50 disabled:opacity-50"
              title="Verify review"
            >
              <Check className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => handleReject(row)}
              disabled={actionLoading === row.id}
              className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
              title="Reject review"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner text="Loading reviews..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  const stats = {
    total: reviews.length,
    verified: reviews.filter((r) => r.status === 'verified').length,
    unverified: reviews.filter((r) => r.status === 'unverified').length,
    avg: reviews.length > 0
      ? (reviews.reduce((s, r) => s + (Number.isFinite(r.avg_rating) ? r.avg_rating : 0), 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <p className="text-sm text-gray-500">Verified</p>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.verified}</p>
        </div>
        <div className="bg-white rounded-lg border p-5">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-yellow-500" />
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.unverified}</p>
        </div>
        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500">Average Rating</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avg}</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Reviews will appear here once customers leave them." icon={MessageSquare} />
      ) : (
        <DataTable columns={columns} data={reviews} loading={loading} />
      )}

      {/* Review Detail Modal */}
      {viewReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Review Details</h2>
              <button onClick={() => setViewReview(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-bold">{Number(viewReview.avg_rating).toFixed(1)} / 5</span>
                <StatusBadge status={viewReview.status} />
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Skill</p>
                  <p className="font-medium">{viewReview.rating_skill ? `${viewReview.rating_skill}/5` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Timeliness</p>
                  <p className="font-medium">{viewReview.rating_timeliness ? `${viewReview.rating_timeliness}/5` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Communication</p>
                  <p className="font-medium">{viewReview.rating_communication ? `${viewReview.rating_communication}/5` : 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Review</p>
                <p className="text-gray-700 mt-1">{viewReview.review_text || <em className="text-gray-400">No comment</em>}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Merchant</p>
                  <p className="font-medium">{viewReview.business_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium">{viewReview.customer_name}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t">
              {viewReview.status === 'unverified' ? (
                <button
                  onClick={() => { handleVerify(viewReview); setViewReview(null); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  <Check className="h-4 w-4" /> Verify Review
                </button>
              ) : (
                <button
                  onClick={() => { handleReject(viewReview); setViewReview(null); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                >
                  <X className="h-4 w-4" /> Reject Review
                </button>
              )}
              <button
                onClick={() => setViewReview(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
