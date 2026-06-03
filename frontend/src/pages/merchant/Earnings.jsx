import { useState, useEffect } from 'react';
import { bookingService } from '../../api/bookingService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { DollarSign, Briefcase, TrendingUp, Clock } from 'lucide-react';

export default function Earnings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.merchantBookings({ status: 'completed' });
      setBookings(Array.isArray(data) ? data : []);
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

  const thisMonthEarnings = thisMonthBookings.reduce((sum, b) => sum + Number(b.agreed_rate || 0), 0);
  const thisMonthJobs = thisMonthBookings.length;
  const totalEarnings = completedBookings.reduce((sum, b) => sum + Number(b.agreed_rate || 0), 0);
  const avgPerJob = completedBookings.length > 0 ? totalEarnings / completedBookings.length : 0;

  const summaryCards = [
    { label: 'This Month Earnings', value: `NPR ${thisMonthEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'This Month Jobs', value: String(thisMonthJobs), icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Earnings', value: `NPR ${totalEarnings.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Avg Per Job', value: `NPR ${Math.round(avgPerJob).toLocaleString()}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
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
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {completedBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16">
                    <EmptyState title="No transactions yet" description="Earnings will appear here once jobs are completed." icon={DollarSign} />
                  </td>
                </tr>
              ) : (
                completedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-700">{new Date(b.completed_at || b.updated_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">#{b.id}</td>
                    <td className="px-5 py-3 text-gray-700">{b.customer?.name || 'N/A'}</td>
                    <td className="px-5 py-3 text-gray-900 font-medium">NPR {Number(b.agreed_rate).toLocaleString()}</td>
                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
