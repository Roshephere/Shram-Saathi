import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertTriangle, User, Bell, ShieldOff, Send, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Awaiting Customer' },
  { key: 'merchant_waiting', label: 'Awaiting Merchant' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'completed', label: 'Completed' },
];

function getDaysSince(dateStr) {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function AgeBadge({ createdAt }) {
  const days = getDaysSince(createdAt);
  let color = 'bg-gray-100 text-gray-600';
  let icon = null;
  if (days > 14) { color = 'bg-red-100 text-red-700'; icon = <AlertTriangle className="h-3 w-3" />; }
  else if (days > 7) { color = 'bg-amber-100 text-amber-700'; icon = <Clock className="h-3 w-3" />; }
  else { color = 'bg-green-100 text-green-700'; }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon} {days}d
    </span>
  );
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reminderLoading, setReminderLoading] = useState({});
  const [blockLoading, setBlockLoading] = useState({});

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

  const handleReminder = async (transaction) => {
    const id = transaction.id;
    setReminderLoading(prev => ({ ...prev, [id]: true }));
    try {
      await adminService.sendPaymentReminder(transaction.booking_id, transaction.merchant_id);
      toast.success('Reminder sent to merchant!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reminder');
    }
    setReminderLoading(prev => ({ ...prev, [id]: false }));
  };

  const handleBlockMerchant = async (transaction) => {
    if (!confirm(`Block merchant ${transaction.merchant?.business_name || '#'+transaction.merchant_id}? They won't be able to take new bookings.`)) return;
    const id = transaction.id;
    setBlockLoading(prev => ({ ...prev, [id]: true }));
    try {
      await adminService.blockMerchant(transaction.merchant_id);
      toast.success('Merchant blocked');
      loadTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to block merchant');
    }
    setBlockLoading(prev => ({ ...prev, [id]: false }));
  };

  const columns = [
    { key: 'created_at', label: 'Created', render: (row) => {
      const days = getDaysSince(row.created_at);
      return (
        <div>
          <div className="text-sm text-gray-900">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</div>
          <AgeBadge createdAt={row.created_at} />
        </div>
      );
    }},
    { key: 'booking_id', label: 'Booking', render: (row) => <span className="font-mono text-xs">#{row.booking_id}</span> },
    { key: 'merchant', label: 'Merchant', render: (row) => {
      const name = row.merchant?.business_name || `#${row.merchant_id}`;
      const blocked = row.merchant?.is_active === false;
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-gray-900">{name}</span>
          {blocked && <ShieldOff className="h-3.5 w-3.5 text-red-400" />}
        </div>
      );
    }},
    { key: 'customer', label: 'Customer', render: (row) => row.booking?.customer?.name || row.booking?.customer?.email || `#${row.booking?.customer_id}` || '-' },
    { key: 'service_amount', label: 'Amount', render: (row) => row.service_amount ? `NPR ${Number(row.service_amount).toLocaleString()}` : '-' },
    { key: 'commission_amount', label: 'Commission', render: (row) => row.commission_amount ? `NPR ${Number(row.commission_amount).toLocaleString()}` : '-' },
    { key: 'confirmation', label: 'Confirmation', render: (row) => {
      if (row.status === 'completed') {
        return <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle className="h-3.5 w-3.5" /> Complete</span>;
      }
      if (row.customer_confirmed_at && row.merchant_confirmed_at) {
        return <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle className="h-3.5 w-3.5" /> Both confirmed</span>;
      }
      if (row.customer_confirmed_at && !row.merchant_confirmed_at) {
        return <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium"><AlertTriangle className="h-3.5 w-3.5" /> Merchant pending</span>;
      }
      return <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium"><User className="h-3.5 w-3.5" /> Customer pending</span>;
    }},
    { key: 'actions', label: 'Action', render: (row) => {
      const isOverdue = !row.customer_confirmed_at && getDaysSince(row.created_at) > 7;
      const merchantPaid = row.customer_confirmed_at && !row.merchant_confirmed_at && getDaysSince(row.customer_confirmed_at) > 3;
      const needsAction = (isOverdue || merchantPaid) && row.status !== 'completed';

      if (!needsAction) return <span className="text-xs text-gray-400">—</span>;

      return (
        <div className="flex gap-1.5">
          {isOverdue && (
            <button onClick={() => handleReminder(row)} disabled={reminderLoading[row.id]}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              <Send className="h-3 w-3" />
              {reminderLoading[row.id] ? '...' : 'Remind'}
            </button>
          )}
          {merchantPaid && (
            <button onClick={() => handleReminder(row)} disabled={reminderLoading[row.id]}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50">
              <Bell className="h-3 w-3" />
              {reminderLoading[row.id] ? '...' : 'Chase'}
            </button>
          )}
          {isOverdue && (
            <button onClick={() => handleBlockMerchant(row)} disabled={blockLoading[row.id]}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              <ShieldOff className="h-3 w-3" />
              {blockLoading[row.id] ? '...' : 'Block'}
            </button>
          )}
        </div>
      );
    }},
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  const filtered = transactions.filter((t) => {
    const matchSearch = !search ||
      (t.booking_id && String(t.booking_id).toLowerCase().includes(search.toLowerCase())) ||
      (t.merchant?.business_name && t.merchant.business_name.toLowerCase().includes(search.toLowerCase())) ||
      (t.booking?.customer?.name && t.booking.customer.name.toLowerCase().includes(search.toLowerCase()));

    let matchStatus = true;
    if (statusFilter === 'pending') {
      matchStatus = !t.customer_confirmed_at && t.status !== 'completed';
    } else if (statusFilter === 'merchant_waiting') {
      matchStatus = !!t.customer_confirmed_at && !t.merchant_confirmed_at && t.status !== 'completed';
    } else if (statusFilter === 'overdue') {
      matchStatus = getDaysSince(t.created_at) > 7 && t.status !== 'completed';
    } else if (statusFilter === 'completed') {
      matchStatus = t.status === 'completed';
    }

    let matchDate = true;
    if (dateFrom && t.created_at) {
      matchDate = matchDate && new Date(t.created_at) >= new Date(dateFrom);
    }
    if (dateTo && t.created_at) {
      matchDate = matchDate && new Date(t.created_at) <= new Date(dateTo + 'T23:59:59');
    }

    return matchSearch && matchStatus && matchDate;
  });

  const totalRevenue = filtered.reduce((sum, t) => sum + (Number(t.service_amount) || 0), 0);
  const totalCommission = filtered.reduce((sum, t) => sum + (Number(t.commission_amount) || 0), 0);
  const awaitingCustomer = transactions.filter((t) => !t.customer_confirmed_at && t.status !== 'completed').length;
  const awaitingMerchant = transactions.filter((t) => t.customer_confirmed_at && !t.merchant_confirmed_at && t.status !== 'completed').length;
  const overdueCount = transactions.filter((t) => getDaysSince(t.created_at) > 7 && t.status !== 'completed').length;

  const stats = [
    { label: 'Total Revenue', value: `NPR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Commission Earned', value: `NPR ${totalCommission.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Awaiting Customer', value: awaitingCustomer, icon: User, color: 'text-red-500', bg: 'bg-red-50', desc: 'Customer hasn\'t confirmed payment' },
    { label: 'Overdue (>7 days)', value: overdueCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', desc: 'Need admin action' },
  ];

  if (loading) return <LoadingSpinner text="Loading transactions..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadTransactions} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor payments and enforce commission collection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.desc && <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>}
              </div>
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="border-b border-gray-200">
          <nav className="flex gap-4 -mb-px overflow-x-auto">
            {statusTabs.map((tab) => (
              <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  statusFilter === tab.key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {tab.label}
                {tab.key === 'pending' && awaitingCustomer > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">{awaitingCustomer}</span>
                )}
                {tab.key === 'merchant_waiting' && awaitingMerchant > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-600 rounded-full">{awaitingMerchant}</span>
                )}
                {tab.key === 'overdue' && overdueCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-200 text-red-700 rounded-full">{overdueCount}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

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
          No transactions match your filters
        </div>
      )}
    </div>
  );
}
