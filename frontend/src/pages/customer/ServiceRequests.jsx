import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../api/requestService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import RequestCard from '../../components/ui/RequestCard';
import { FileText, PlusCircle } from 'lucide-react';

export default function ServiceRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadRequests(); }, [filter]);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await requestService.getAll(params);
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading requests..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadRequests} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Service Requests</h1>
        <button onClick={() => navigate('/customer/service-requests/create')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <PlusCircle className="h-4 w-4" />
          New Request
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'open', 'assigned', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
              filter === s ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <EmptyState title="No requests found" description="Create a new service request to get started." icon={FileText} />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <RequestCard key={req.id} request={req} onClick={() => navigate(`/customer/service-requests/${req.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
