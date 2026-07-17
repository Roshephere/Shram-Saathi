import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { merchantService } from '../../api/merchantService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { Users, UserCheck, Briefcase, FileText, Star, ShoppingBag, DollarSign, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
      console.log('Dashboard Stats:', dashboardStats);
    } catch {
      try {
        const merchants = await merchantService.getAll();
        const list = Array.isArray(merchants) ? merchants : [];
        setStats({
          total_merchants: list.length,
          pending_merchants: list.filter((m) => m.status === 'pending').length,
          active_merchants: list.filter((m) => m.status === 'active').length,
          total_bookings: 0,
          completed_bookings: 0,
          total_revenue: 0,
          platform_commission: 0,
          pending_transactions: 0,
        });
      } catch {
        setError('Failed to load dashboard stats');
      }
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadStats} />;

  const items = [
    { label: 'Total Merchants', value: stats?.total_merchants ?? 'N/A', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Verifications', value: stats?.pending_verifications ?? stats?.pending_merchants ?? 'N/A', icon: Users, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Active Merchants', value: stats?.active_merchants ?? 'N/A', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Bookings', value: stats?.total_bookings ?? 'N/A', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Completed Bookings', value: stats?.completed_bookings ?? 'N/A', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Revenue', value: stats?.total_revenue ? `NPR ${Number(stats.total_revenue).toLocaleString()}` : 'N/A', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Platform Commission', value: stats?.platform_commission ? `NPR ${Number(stats.platform_commission).toLocaleString()}` : 'N/A', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Transactions', value: stats?.pending_transactions ?? 'N/A', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((stat) => (
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
    </div>
  );
}
