import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { requestService } from '../../api/requestService';
import { bookingService } from '../../api/bookingService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Modal from '../../components/ui/Modal';
import { ArrowLeft, DollarSign, MapPin, Clock, User, Navigation, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MerchantRequestDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [bidModal, setBidModal] = useState(false);
  const [bidForm, setBidForm] = useState({ proposed_rate: '', message: '', scheduled_at: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data: request, isLoading, error, refetch } = useQuery({
    queryKey: ['merchant-request-detail', requestId],
    queryFn: () => requestService.getById(requestId),
  });

  const { data: myBids = [] } = useQuery({
    queryKey: ['merchant-bids-check', requestId],
    queryFn: () => bookingService.merchantBookings({ service_request_id: requestId })
      .then((r) => Array.isArray(r.data) ? r.data : []),
    enabled: !!requestId,
  });

  const openBidModal = () => {
    const defaultRate = request?.budget_min ? Number(request.budget_min) : '';
    setBidForm({ proposed_rate: String(defaultRate), message: '', scheduled_at: '' });
    setBidModal(true);
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookingService.create({
        service_request_id: Number(requestId),
        proposed_rate: Number(bidForm.proposed_rate),
        message: bidForm.message || undefined,
        scheduled_at: bidForm.scheduled_at || undefined,
      });
      toast.success('Bid submitted! Waiting for customer response.');
      setBidModal(false);
      navigate('/merchant/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading request..." />;
  if (error) return <ErrorMessage message="Failed to load request" onRetry={refetch} />;
  if (!request) return <ErrorMessage message="Request not found" />;

  const hasBidded = myBids.some((b) => ['bidding', 'accepted'].includes(b.status));
  const requestClosed = request.status !== 'open';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/merchant/requests/available')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to Available
      </button>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{request.title || 'Untitled Request'}</h1>
            <p className="text-sm text-gray-500 mt-1">Request #{request.id}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{request.status}</span>
        </div>

        {request.description && <p className="mt-4 text-gray-700">{request.description}</p>}

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {request.category && (
            <div><p className="text-xs text-gray-500">Category</p><p className="text-sm font-medium text-gray-900">{request.category.name || request.category}</p></div>
          )}
          {request.budget_min && (
            <div><p className="text-xs text-gray-500">Budget Range</p><p className="text-sm font-medium text-gray-900">NPR {Number(request.budget_min).toLocaleString()}{request.budget_max ? ` - ${Number(request.budget_max).toLocaleString()}` : ''}</p></div>
          )}
          {request.urgency && (
            <div><p className="text-xs text-gray-500">Urgency</p><p className="text-sm font-medium text-gray-900">Level {request.urgency}</p></div>
          )}
          <div><p className="text-xs text-gray-500">Posted</p><p className="text-sm font-medium text-gray-900">{new Date(request.created_at).toLocaleDateString()}</p></div>
        </div>

        {request.location_text && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />{request.location_text}
            {request.latitude && request.longitude && <span className="text-gray-400">({Number(request.latitude).toFixed(4)}, {Number(request.longitude).toFixed(4)})</span>}
          </div>
        )}

        {request.user && (
          <div className="mt-6 pt-4 border-t">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Customer</h2>
            <p className="text-sm text-gray-700">{request.user.name || `Customer #${request.user_id}`}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Submit Your Bid</h2>
        <p className="text-sm text-gray-600 mb-4">
          {hasBidded
            ? 'You have already placed a bid on this request. Waiting for the customer to respond.'
            : requestClosed
              ? 'This request is no longer accepting bids.'
              : `Set your price and message the customer. Budget range: NPR ${Number(request.budget_min).toLocaleString()} - ${Number(request.budget_max).toLocaleString()}.`
          }
        </p>
        {hasBidded ? (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg px-4 py-2.5 text-sm font-medium">
            <CheckCircle className="h-4 w-4" /> Bid Placed
          </div>
        ) : !requestClosed && (
          <button onClick={openBidModal}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 text-sm">
            Place Bid
          </button>
        )}
      </div>

      <Modal open={bidModal} onClose={() => setBidModal(false)} title="Place Your Bid" size="md">
        <form onSubmit={handleSubmitBid} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Proposed Rate (NPR) *</label>
            <input type="number" required min={request?.budget_min || 0} max={request?.budget_max || 999999}
              value={bidForm.proposed_rate} onChange={(e) => setBidForm({ ...bidForm, proposed_rate: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            {request?.budget_min && request?.budget_max && (
              <p className="text-xs text-gray-400 mt-1">Must be between NPR {Number(request.budget_min).toLocaleString()} and {Number(request.budget_max).toLocaleString()}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message to Customer</label>
            <textarea rows={3} value={bidForm.message} onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., I can start tomorrow, estimate 2 days to complete..." maxLength={255} />
            <p className="text-xs text-gray-400 mt-1">{bidForm.message.length}/255</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion</label>
            <input type="datetime-local" value={bidForm.scheduled_at}
              onChange={(e) => setBidForm({ ...bidForm, scheduled_at: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setBidModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Bid'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}