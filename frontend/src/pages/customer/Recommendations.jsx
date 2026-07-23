import { useState, useEffect } from 'react';
import { recommendationService } from '../../api/recommendationService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import MerchantCard from '../../components/ui/MerchantCard';
import { Star } from 'lucide-react';

export default function Recommendations() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setRequests(user.service_requests || []);
      } catch {}
    }
  }, []);

  const loadRecommendations = async (requestId) => {
    setLoading(true);
    setError(null);
    setSelectedRequest(requestId);
    try {
      const data = await recommendationService.getHybrid(requestId);
      setRecommendations(Array.isArray(data) ? data : []);
    } catch {
      setError('Recommendation endpoint not available yet');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Recommendations</h1>

      {!selectedRequest && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Service Request</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No service requests found. Create one first.</p>
          ) : (
            <div className="space-y-2">
              {requests.map((req) => (
                <button key={req.id} onClick={() => loadRecommendations(req.id)}
                  className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">{req.title}</p>
                  <p className="text-sm text-gray-500">{req.status} · {req.category?.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && <LoadingSpinner text="Loading recommendations..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && selectedRequest && recommendations.length === 0 && !error && (
        <EmptyState title="No recommendations" description="No workers matched your request criteria." icon={Star} />
      )}

      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recommended Workers ({recommendations.length})
            </h2>
            <button onClick={() => { setSelectedRequest(null); setRecommendations([]); }}
              className="text-sm text-indigo-600 hover:underline">
              Change Request
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((m) => (
              <MerchantCard key={m.id} merchant={m} selectLabel="Hire Worker" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
