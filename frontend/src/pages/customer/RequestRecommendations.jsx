import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestService } from '../../api/requestService';
import { recommendationService } from '../../api/recommendationService';
import { bookingService } from '../../api/bookingService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import MerchantCard from '../../components/ui/MerchantCard';
import { ArrowLeft, Star, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

function mapRecToMerchant(rec) {
  return {
    id: rec.merchant_id,
    business_name: rec.business_name,
    avg_rating: rec.avg_rating,
    review_count: rec.review_count,
    hourly_rate: rec.hourly_rate,
    score: rec.score,
    distance: rec.distance_km,
    location: rec.location?.address || rec.location?.label || '',
    phone: rec.phone,
  };
}

export default function RequestRecommendations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({ agreed_rate: '', scheduled_at: '', special_notes: '' });

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const reqData = await requestService.getById(id);
      setRequest(reqData);
      try {
        const recData = await recommendationService.getHybrid(id);
        setRecommendations(Array.isArray(recData) ? recData : []);
      } catch {
        setRecommendations([]);
      }
    } catch {
      setError('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const openHireModal = (merchant) => {
    setSelectedMerchant(merchant);
    setBookingForm({
      agreed_rate: String(merchant.hourly_rate || ''),
      scheduled_at: '',
      special_notes: '',
    });
  };

  const handleHire = async (e) => {
    e.preventDefault();
    if (!selectedMerchant) return;
    setSubmitting(true);
    try {
      await bookingService.create({
        service_request_id: Number(id),
        merchant_id: selectedMerchant.merchant_id,
        agreed_rate: Number(bookingForm.agreed_rate),
        scheduled_at: bookingForm.scheduled_at || undefined,
        special_notes: bookingForm.special_notes || undefined,
      });
      toast.success('Worker hired! Booking created.');
      navigate('/customer/bookings');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to hire worker';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading recommendations..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;
  if (!request) return <ErrorMessage message="Request not found" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/customer/service-requests')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to Requests
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
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {request.category && (
            <div><p className="text-xs text-gray-500">Category</p><p className="font-medium text-gray-900">{request.category.name || request.category}</p></div>
          )}
          {request.budget_min && (
            <div><p className="text-xs text-gray-500">Budget</p><p className="font-medium text-gray-900">NPR {Number(request.budget_min).toLocaleString()}{request.budget_max ? ` - ${Number(request.budget_max).toLocaleString()}` : ''}</p></div>
          )}
          {request.urgency && (
            <div><p className="text-xs text-gray-500">Urgency</p><p className="font-medium text-gray-900">Level {request.urgency}</p></div>
          )}
          <div><p className="text-xs text-gray-500">Created</p><p className="font-medium text-gray-900">{new Date(request.created_at).toLocaleDateString()}</p></div>
        </div>
        {request.location_text && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />{request.location_text}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Workers</h2>
        {recommendations.length === 0 ? (
          <EmptyState title="No recommendations" description="No workers matched your request." icon={Star} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <MerchantCard
                key={rec.merchant_id}
                merchant={mapRecToMerchant(rec)}
                onSelect={() => openHireModal(rec)}
                selectLabel="Hire"
              />
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selectedMerchant} onClose={() => setSelectedMerchant(null)} title={`Hire ${selectedMerchant?.business_name || 'Worker'}`} size="md">
        <form onSubmit={handleHire} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agreed Rate (NPR) *</label>
            <input type="number" required min="0" step="0.01" value={bookingForm.agreed_rate}
              onChange={(e) => setBookingForm({ ...bookingForm, agreed_rate: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            {request?.budget_min && request?.budget_max && (
              <p className="text-xs text-gray-400 mt-1">Budget range: NPR {Number(request.budget_min).toLocaleString()} - {Number(request.budget_max).toLocaleString()}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
            <input type="datetime-local" value={bookingForm.scheduled_at}
              onChange={(e) => setBookingForm({ ...bookingForm, scheduled_at: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
            <textarea rows={3} value={bookingForm.special_notes}
              onChange={(e) => setBookingForm({ ...bookingForm, special_notes: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Any additional instructions..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setSelectedMerchant(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? 'Creating...' : 'Confirm Hire'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}