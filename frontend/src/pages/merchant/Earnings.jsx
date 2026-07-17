import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../api/bookingService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { DollarSign, Briefcase, TrendingUp, Clock, Eye, CheckCircle, AlertCircle } from 'lucide-react';

export default function Earnings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.merchantBookings({ status: 'completed' });
      const list = Array.isArray(result?.data) ? result.data : [];
      setBookings(list);

      // Fetch transaction for each completed booking
      const txMap = {};
      await Promise.all(
        list.map(async (b) => {
          try {
            const tx = await bookingService.getTransaction(b.id);
            if (tx) txMap[b.id] = tx;
          } catch { /* no transaction */ }
        })
      );
      setTransactions(txMap);
    } catch {
      setError('Failed to load earnings data');
    }
    setLoading(false);
  };

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const thisMonthBookings = completedBookings.filter((b) => {
    const d = new Date(b.completed_at || b.updated_at || b.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const totalReceived = completedBookings.filter((b) => {
    const tx = transactions[b.id];
    return tx && (tx.status === 'completed' || (tx.customer_confirmed_at && tx.merchant_confirmed_at));
  }).reduce((sum, b) => sum + Number(transactions[b.id]?.merchant_amount || b.agreed_rate || 0), 0);

  const pendingAmount = completedBookings.filter((b) => {
    const tx = transactions[b.id];
    return !tx || (tx.status !== 'completed' && !(tx.customer_confirmed_at && tx.merchant_confirmed_at));
  }).reduce((sum, b) => sum + Number(transactions[b.id]?.merchant_amount || b.agreed_rate || 0), 0);

  const thisMonthEarnings = thisMonthBookings.reduce((sum, b) => {
    const tx = transactions[b.id];
    return sum + Number(tx?.merchant_amount || b.agreed_rate || 0);
  }, 0);

  const totalFees = completedBookings.reduce((sum, b) => {
    const tx = transactions[b.id];
    return sum + Number(tx?.commission_amount || 0);
  }, 0);

  const summaryCards = [
    { label: 'Total Received', value: `NPR ${totalReceived.toLocaleString()}`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Payment', value: `NPR ${pendingAmount.toLocaleString()}`, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'This Month', value: `NPR ${thisMonthEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Platform Fees Paid', value: `NPR ${totalFees.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  if (loading) return <LoadingSpinner text="Loading earnings..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat) => (
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

      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Booking</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Your Payout</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {completedBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16">
                    <EmptyState title="No transactions yet" description="Earnings will appear here once jobs are completed." icon={DollarSign} />
                  </td>
                </tr>
              ) : (
                completedBookings.map((b) => {
                  const tx = transactions[b.id];
                  const isPaid = tx && (tx.status === 'completed' || (tx.customer_confirmed_at && tx.merchant_confirmed_at));
                  return (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-700">{new Date(b.completed_at || b.updated_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">#{b.id}</td>
                      <td className="px-5 py-3 text-gray-700">{b.customer?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-900 font-medium">NPR {Number(b.agreed_rate).toLocaleString()}</td>
                      <td className="px-5 py-3 text-gray-900 font-medium">
                        NPR {Number(tx?.merchant_amount || b.agreed_rate).toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Clock className="h-3 w-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => navigate(`/merchant/bookings/${b.id}`)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
