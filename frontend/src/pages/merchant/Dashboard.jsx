import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { merchantService } from '../../api/merchantService';
import { bookingService } from '../../api/bookingService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import StatusBadge from '../../components/ui/StatusBadge';
import { Briefcase, Star, Users, ShoppingBag } from 'lucide-react';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const [merchant, setMerchant] = useState(null);
  const [services, setServices] = useState([]);
  const [jobsCount, setJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userId = user?.id;
      const merchants = await merchantService.getAll();
      const allMerchants = Array.isArray(merchants) ? merchants : [];
      const myMerchant = allMerchants.find((m) => m.user_id === userId);
      setMerchant(myMerchant || null);

      if (myMerchant) {
        const [svc, activeBookings, completedBookings] = await Promise.allSettled([
          merchantService.getServiceCategories(myMerchant.id),
          bookingService.merchantBookings({ status: 'accepted' }),
          bookingService.merchantBookings({ status: 'completed' }),
        ]);
        if (svc.status === 'fulfilled') setServices(Array.isArray(svc.value) ? svc.value : []);
        const active = activeBookings.status === 'fulfilled' && Array.isArray(activeBookings.value) ? activeBookings.value.length : 0;
        const completed = completedBookings.status === 'fulfilled' && Array.isArray(completedBookings.value) ? completedBookings.value.length : 0;
        setJobsCount(active + completed);
      }
    } catch (err) {
      setError('Failed to load merchant data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  if (!merchant) {
    return (
      <div className="text-center py-16">
        <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Merchant Profile Not Found</h2>
        <p className="text-gray-500 mt-2">Complete your merchant registration to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{merchant.business_name || 'Unnamed Business'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={merchant.status} />
              {merchant.verified_at && <StatusBadge status="verified" />}
            </div>
          </div>
          <div className="text-center">
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400 mx-auto" />
            <p className="text-2xl font-bold text-gray-900">{merchant.avg_rating ? Number(merchant.avg_rating).toFixed(1) : 'N/A'}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium">{merchant.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-medium">{merchant.location || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Hourly Rate</p>
            <p className="text-sm font-medium">{merchant.hourly_rate ? `NPR ${Number(merchant.hourly_rate).toLocaleString()}` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Services</p>
            <p className="text-sm font-medium">{services.length} categories</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Services Offered', value: services.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Average Rating', value: merchant.avg_rating ? Number(merchant.avg_rating).toFixed(1) : 'N/A', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Jobs', value: jobsCount, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
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
    </div>
  );
}
