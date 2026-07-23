import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { requestService } from '../../api/requestService';
import { recommendationService } from '../../api/recommendationService';
import { bookingService } from '../../api/bookingService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { ArrowLeft, DollarSign, MapPin, Star, Clock, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RequestBids() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedBid, setSelectedBid] = useState(null);
  const [accepting, setAccepting] = useState(false);

  const { data: request, isLoading: reqLoading } = useQuery({
    queryKey: ['serviceRequest', id],
    queryFn: () => requestService.getById(id),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations', id],
    queryFn: () => recommendationService.getHybrid(id).then((d) => Array.isArray(d) ? d : []),
  });

  const { data: bids = [], isLoading: bidsLoading } = useQuery({
    queryKey: ['requestBids', id],
    queryFn: () => bookingService.getAll({ service_request_id: id }).then((d) => Array.isArray(d) ? d : []),
    refetchInterval: 5000,
  });

  const handleSelectBid = async () => {
    if (!selectedBid) return;
    setAccepting(true);
    try {
      await bookingService.select(selectedBid.id);
      toast.success('Bid accepted! Work will begin shortly.');
      navigate(`/customer/bookings/${selectedBid.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept bid');
    } finally {
      setAccepting(false);
      setSelectedBid(null);
    }
  };

  if (reqLoading) return <LoadingSpinner text="Loading..." />;
  if (!request) return <ErrorMessage message="Request not found" />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate('/customer/service-requests')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to Requests
      </button>

      <div className="bg-white rounded-xl border p-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{request.title || 'Untitled Request'}</h1>
            <p className="text-sm text-gray-500 mt-1">Request #{request.id}</p>
          </div>
          <StatusBadge status={request.status} />
        </div>
        {request.description && <p className="mt-3 text-gray-700 text-sm">{request.description}</p>}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-600">
          {request.budget_min && (
            <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> NPR {Number(request.budget_min).toLocaleString()}{request.budget_max ? ` - ${Number(request.budget_max).toLocaleString()}` : ''}</span>
          )}
          {request.urgency && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Urgency Level {request.urgency}</span>}
          {request.location_text && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {request.location_text}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Recommended Workers</h2>
            {recommendations.length === 0 ? (
              <p className="text-sm text-gray-500">No recommendations yet.</p>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div key={rec.merchant_id} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {rec.business_name?.[0] || 'M'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{rec.business_name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          {rec.avg_rating ? Number(rec.avg_rating).toFixed(1) : 'N/A'}
                          {rec.distance_km !== undefined && <span> &middot; {Number(rec.distance_km).toFixed(1)} km</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Incoming Bids
                {bids.length > 0 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{bids.length} active</span>}
              </h2>
              <span className="text-xs text-gray-400">Auto-refreshes every 5s</span>
            </div>

            {bidsLoading ? (
              <LoadingSpinner size="sm" text="Loading bids..." />
            ) : bids.length === 0 ? (
              <EmptyState title="No bids yet" description="Merchants will place bids here. Check back soon." />
            ) : (
              <div className="space-y-3">
                {bids.map((bid) => {
                  const merchant = bid.merchant;
                  return (
                    <div key={bid.id} className={`rounded-lg border p-4 ${bid.status === 'accepted' ? 'bg-green-50 border-green-300' : 'bg-white'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {merchant?.business_name?.[0] || 'M'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{merchant?.business_name || 'Worker'}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                              {merchant?.avg_rating ? Number(merchant.avg_rating).toFixed(1) : 'N/A'}
                              <span className="mx-1">&middot;</span>
                              {merchant?.review_count || 0} reviews
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={bid.status} />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        <span className="font-semibold text-gray-900">NPR {Number(bid.agreed_rate).toLocaleString()}</span>
                        <span className="text-gray-500 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(bid.created_at).toLocaleString()}</span>
                      </div>

                      {bid.special_notes && (
                        <div className="mt-2 bg-gray-50 rounded p-2 text-sm text-gray-600 flex items-start gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          {bid.special_notes}
                        </div>
                      )}

                      {bid.status === 'bidding' && (
                        <div className="mt-3 flex justify-end">
                          <button onClick={() => setSelectedBid(bid)}
                            className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                            Select & Accept
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={!!selectedBid} onClose={() => setSelectedBid(null)} title="Accept This Bid?" size="sm">
        <p className="text-sm text-gray-600">
          You are about to accept the bid from <strong>{selectedBid?.merchant?.business_name || 'this worker'}</strong> for <strong>NPR {Number(selectedBid?.agreed_rate).toLocaleString()}</strong>.
          Other bids for this request will be automatically rejected.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setSelectedBid(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={handleSelectBid} disabled={accepting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {accepting ? 'Accepting...' : 'Yes, Accept Bid'}
          </button>
        </div>
      </Modal>
    </div>
  );
}