import { useState, useEffect } from 'react';
import { merchantService } from '../../api/merchantService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import DataTable from '../../components/ui/DataTable';
import { Star, MessageSquare } from 'lucide-react';

export default function AdminReviews() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await merchantService.getAll();
      const list = Array.isArray(data) ? data : [];
      const rated = list.filter((m) => m.avg_rating !== null && m.avg_rating !== undefined);
      setMerchants(rated);
    } catch {
      setError('Failed to load review data');
    }
    setLoading(false);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'business_name', label: 'Merchant' },
    {
      key: 'avg_rating', label: 'Rating',
      render: (row) => {
        const rating = Number(row.avg_rating || 0);
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
          </div>
        );
      },
    },
    {
      key: 'status', label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  if (loading) return <LoadingSpinner text="Loading reviews..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  const stats = {
    total: merchants.length,
    rated: merchants.filter((m) => Number(m.avg_rating || 0) > 0).length,
    avg: merchants.length > 0
      ? (merchants.reduce((s, m) => s + Number(m.avg_rating || 0), 0) / merchants.length).toFixed(1)
      : '0.0',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500">Merchants with Reviews</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500">Rated Merchants</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.rated}</p>
        </div>
        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500">Average Platform Rating</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avg}</p>
        </div>
      </div>

      {merchants.length === 0 ? (
        <EmptyState title="No reviews yet" description="Merchants with ratings will appear here once customers leave reviews." icon={MessageSquare} />
      ) : (
        <DataTable columns={columns} data={merchants} loading={loading} />
      )}
    </div>
  );
}
