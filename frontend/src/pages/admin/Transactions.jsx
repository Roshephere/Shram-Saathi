import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react';

const columns = [
  { key: 'created_at', label: 'Date', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-' },
  { key: 'booking_id', label: 'Booking ID' },
  { key: 'merchant_name', label: 'Merchant' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'amount', label: 'Amount', render: (row) => row.amount ? `NPR ${Number(row.amount).toLocaleString()}` : '-' },
  { key: 'commission', label: 'Commission', render: (row) => row.commission ? `NPR ${Number(row.commission).toLocaleString()}` : '-' },
  { key: 'net', label: 'Net', render: (row) => row.net ? `NPR ${Number(row.net).toLocaleString()}` : '-' },
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
      const data = await adminService.getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      setError('Transactions endpoint pending');
    }
    setLoading(false);
  };

  const filtered = transactions.filter((t) => {
    const matchSearch = !search ||
      (t.booking_id && String(t.booking_id).toLowerCase().includes(search.toLowerCase())) ||
      (t.merchant_name && t.merchant_name.toLowerCase().includes(search.toLowerCase())) ||
      (t.customer_name && t.customer_name.toLowerCase().includes(search.toLowerCase()));

    let matchDate = true;
    if (dateFrom && t.created_at) {
      matchDate = matchDate && new Date(t.created_at) >= new Date(dateFrom);
    }
    if (dateTo && t.created_at) {
      matchDate = matchDate && new Date(t.created_at) <= new Date(dateTo + 'T23:59:59');
    }

    return matchSearch && matchDate;
  });

  const totalRevenue = filtered.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalCommission = filtered.reduce((sum, t) => sum + (Number(t.commission) || 0), 0);
  const uniqueMerchants = new Set(filtered.map((t) => t.merchant_name).filter(Boolean)).size;
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

      {(transactions.length === 0 || filtered.length === 0) && (
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed text-center">
          <p className="text-xs text-gray-400 font-mono">
            Backend endpoint pending: GET /api/admin/transactions (requires TransactionController implementation)
          </p>
        </div>
      )}
    </div>
  );
}
