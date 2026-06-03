import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestService } from '../../api/requestService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import StatusBadge from '../../components/ui/StatusBadge';
import { ArrowLeft, DollarSign, MapPin, Calendar, Star } from 'lucide-react';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const reqData = await requestService.getById(id);
      setRequest(reqData);
    } catch {
      setError('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading details..." />;
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
          <StatusBadge status={request.status} />
        </div>

        {request.description && (
          <p className="mt-4 text-gray-700">{request.description}</p>
        )}

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {request.category && (
            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-sm font-medium text-gray-900">{request.category.name || request.category}</p>
            </div>
          )}
          {request.budget_min && (
            <div>
              <p className="text-xs text-gray-500">Budget</p>
              <p className="text-sm font-medium text-gray-900">
                NPR {Number(request.budget_min).toLocaleString()}
                {request.budget_max ? ` - ${Number(request.budget_max).toLocaleString()}` : ''}
              </p>
            </div>
          )}
          {request.urgency && (
            <div>
              <p className="text-xs text-gray-500">Urgency</p>
              <p className="text-sm font-medium text-gray-900">Level {request.urgency}</p>
            </div>
          )}
          {request.created_at && (
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm font-medium text-gray-900">{new Date(request.created_at).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {request.location_text && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {request.location_text}
            {request.latitude && request.longitude && (
              <span className="text-gray-400">({request.latitude}, {request.longitude})</span>
            )}
          </div>
        )}
      </div>

      {request.status === 'open' && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hire a Worker</h2>
          <p className="text-sm text-gray-600 mb-4">
            View recommended workers for this service request and hire the best fit.
          </p>
          <button onClick={() => navigate(`/customer/requests/${id}/bids`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
            <Star className="h-4 w-4" /> View Recommendations & Hire
          </button>
        </div>
      )}
    </div>
  );
}