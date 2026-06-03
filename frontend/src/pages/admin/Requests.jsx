import { useState, useEffect } from 'react';
import { requestService } from '../../api/requestService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'user_id', label: 'User ID' },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'urgency', label: 'Urgency' },
  { key: 'budget_min', label: 'Budget Min', render: (row) => row.budget_min ? `NPR ${Number(row.budget_min).toLocaleString()}` : '-' },
  { key: 'created_at', label: 'Created', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-' },
];

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestService.getAll();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setError('Service requests endpoint pending. Controller is a stub.');
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner text="Loading requests..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadRequests} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Service Request Management</h1>
      <DataTable columns={columns} data={requests} loading={loading} />
      {requests.length === 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed text-center">
          <p className="text-xs text-gray-400 font-mono">
            Pending endpoint: GET /api/service-requests (requires ServiceRequestsController implementation)
          </p>
        </div>
      )}
    </div>
  );
}
