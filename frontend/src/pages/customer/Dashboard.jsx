import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { requestService } from '../../api/requestService';
import { recommendationService } from '../../api/recommendationService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import RequestCard from '../../components/ui/RequestCard';
import MerchantCard from '../../components/ui/MerchantCard';
import { FileText, Clock, CheckCircle, Star, PlusCircle } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqData, recData] = await Promise.allSettled([
        requestService.getAll({ user_id: user?.id }),
        recommendationService.getByCategory(1, { limit: 3 }).catch(() => []),
      ]);
      if (reqData.status === 'fulfilled') setRequests(Array.isArray(reqData.value) ? reqData.value : []);
      if (recData.status === 'fulfilled') setRecommendations(Array.isArray(recData.value) ? recData.value : []);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const openRequests = requests.filter((r) => r.status === 'open').length;
  const assignedRequests = requests.filter((r) => r.status === 'assigned').length;
  const completedRequests = requests.filter((r) => r.status === 'completed').length;

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
        <button
          onClick={() => navigate('/customer/service-requests/create')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <PlusCircle className="h-4 w-4" />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Requests', value: openRequests, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Assigned', value: assignedRequests, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Completed', value: completedRequests, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Recommendations', value: recommendations.length, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recommended Workers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((m) => (
              <MerchantCard key={m.id} merchant={m} onSelect={() => navigate('/customer/browse')} selectLabel="View All" />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Recent Service Requests</h2>
          <button onClick={() => navigate('/customer/service-requests')} className="text-sm text-indigo-600 hover:underline">
            View All
          </button>
        </div>
        {requests.length === 0 ? (
          <EmptyState title="No requests yet" description="Create your first service request to get started." icon={FileText} />
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 5).map((req) => (
              <RequestCard key={req.id} request={req} onClick={() => navigate(`/customer/service-requests/${req.id}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
