import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react';

const columns = [
  { key: 'created_at', label: 'Date', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-' },
  { key: 'booking_id', label: 'Booking ID' },
  {
    key: 'merchant', label: 'Merchant',
    render: (row) => row.merchant?.business_name || `Merchant #${row.merchant_id}` || '-',
  },
  {
    key: 'customer', label: 'Customer',
    render: (row) => row.booking?.customer?.name || row.booking?.customer?.email || `User #${row.booking?.customer_id}` || '-',
  },
  { key: 'service_amount', label: 'Amount', render: (row) => row.service_amount ? `NPR ${Number(row.service_amount).toLocaleString()}` : '-' },
  { key: 'commission_amount', label: 'Commission', render: (row) => row.commission_amount ? `NPR ${Number(row.commission_amount).toLocaleString()}` : '-' },
  { key: 'merchant_amount', label: 'Net', render: (row) => row.merchant_amount ? `NPR ${Number(row.merchant_amount).toLocaleString()}` : '-' },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => { loadTransactions(); }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.getTransactions();
      setTransactions(Array.isArray(result?.data) ? result.data : []);
    } catch {
      setError('Failed to load transactions');
    }
    setLoading(false);
  };

  const filtered = transactions.filter((t) => {
    const matchSearch = !search ||
      (t.booking_id && String(t.booking_id).toLowerCase().includes(search.toLowerCase())) ||
      (t.merchant?.business_name && t.merchant.business_name.toLowerCase().includes(search.toLowerCase())) ||
      (t.booking?.customer?.name && t.booking.customer.name.toLowerCase().includes(search.toLowerCase()));

    let matchDate = true;
    if (dateFrom && t.created_at) {
      matchDate = matchDate && new Date(t.created_at) >= new Date(dateFrom);
    }
    if (dateTo && t.created_at) {
      matchDate = matchDate && new Date(t.created_at) <= new Date(dateTo + 'T23:59:59');
    }

    return matchSearch && matchDate;
  });

  const totalRevenue = filtered.reduce((sum, t) => sum + (Number(t.service_amount) || 0), 0);
  const totalCommission = filtered.reduce((sum, t) => sum + (Number(t.commission_amount) || 0), 0);
  const uniqueMerchants = new Set(filtered.map((t) => t.merchant?.business_name).filter(Boolean)).size;
  const pendingCount = filtered.filter((t) => t.status === 'pending').length;

  const stats = [
    { label: 'Total Revenue', value: `NPR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Platform Commission', value: `NPR ${totalCommission.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Merchants', value: uniqueMerchants, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Verifications', value: pendingCount, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  if (loading) return <LoadingSpinner text="Loading transactions..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadTransactions} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <input
              type="text" placeholder="Search by booking ID, merchant, customer..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <input
              type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <input
              type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <DataTable columns={columns} data={filtered} loading={loading} />
      </div>

      {transactions.length === 0 && (
        <EmptyState title="No transactions yet" description="Transactions will appear here once bookings are completed." icon={DollarSign} />
      )}
      {transactions.length > 0 && filtered.length === 0 && (
        <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
          No transactions match your search
        </div>
      )}
    </div>
  );
}
