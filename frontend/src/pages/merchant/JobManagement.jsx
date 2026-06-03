import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../api/bookingService';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { ShoppingBag, Eye, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { key: 'bidding', label: 'Active Bids', statuses: ['bidding'] },
  { key: 'active', label: 'Active Jobs', statuses: ['accepted', 'in_progress'] },
  { key: 'completed', label: 'Completed', statuses: ['completed'] },
  { key: 'rejected', label: 'Rejected', statuses: ['rejected'] },
];

export default function JobManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bidding');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.merchantBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load bookings');
    }
    setLoading(false);
  };

  const currentTab = tabs.find((t) => t.key === activeTab);
  const filtered = bookings.filter((b) => currentTab?.statuses.includes(b.status));

  if (loading) return <LoadingSpinner text="Loading..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadBookings} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Bids & Jobs</h1>

      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => {
            const count = bookings.filter((b) => tab.statuses.includes(b.status)).length;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {tab.label}
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{count}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={`No ${currentTab?.label.toLowerCase()}`} description={`You have no ${currentTab?.label.toLowerCase()} at the moment.`} icon={ShoppingBag} />
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const customer = booking.customer;
            const serviceRequest = booking.service_request || booking.serviceRequest;
            return (
              <div key={booking.id} className="bg-white rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{serviceRequest?.title || 'Service Request'}</h3>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span>{customer?.name || 'Customer'}</span>
                    <span>NPR {Number(booking.agreed_rate).toLocaleString()}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => navigate(`/merchant/bookings/${booking.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="h-4 w-4" /> Details
                  </button>
                  {booking.status === 'bidding' && (
                    <button onClick={async () => {
                      try {
                        await bookingService.reject(booking.id);
                        toast.success('Bid withdrawn');
                        loadBookings();
                      } catch (err) {
                        toast.error(err.response?.data?.message || 'Failed to withdraw');
                      }
                    }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}