import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import { ShoppingBag } from 'lucide-react';

const columns = [
  { key: 'id', label: 'Booking ID' },
  { key: 'service_request_id', label: 'Request ID' },
  {
    key: 'customer', label: 'Customer',
    render: (row) => row.customer?.name || row.customer?.email || `User #${row.customer_id}` || '-',
  },
  {
    key: 'merchant', label: 'Merchant',
    render: (row) => row.merchant?.business_name || `Merchant #${row.merchant_id}` || '-',
  },
  {
    key: 'agreed_rate', label: 'Rate',
    render: (row) => row.agreed_rate ? `NPR ${Number(row.agreed_rate).toLocaleString()}` : '-',
  },
  {
    key: 'status', label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'created_at', label: 'Date',
    render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-',
  },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadBookings(); }, [page]);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.getBookings({ page, per_page: 20 });
      setBookings(Array.isArray(result?.data) ? result.data : []);
      setMeta(result?.meta || {});
    } catch {
      setError('Failed to load bookings');
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner text="Loading bookings..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadBookings} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <span className="text-sm text-gray-500">{meta?.total || bookings.length} bookings</span>
      </div>
      <DataTable columns={columns} data={bookings} loading={loading} />
      <Pagination meta={meta} onPageChange={setPage} />
      {bookings.length === 0 && !loading && (
        <EmptyState title="No bookings yet" description="Bookings will appear here once customers hire workers." icon={ShoppingBag} />
      )}
    </div>
  );
}
