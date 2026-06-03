import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bookingService } from '../../api/bookingService';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ShoppingBag, Eye, XCircle, Star } from 'lucide-react';

const tabs = [
  { key: 'active', label: 'Active', statuses: ['accepted', 'in_progress'] },
  { key: 'completed', label: 'Completed', statuses: ['completed'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['cancelled', 'rejected'] },
];

export default function CustomerBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [cancelTarget, setCancelTarget] = useState(null);

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ['customer-bookings'],
    queryFn: () => bookingService.getCustomerBookings().then((d) => Array.isArray(d) ? d : []),
  });

  const currentTab = tabs.find((t) => t.key === activeTab);
  const filtered = bookings.filter((b) => currentTab?.statuses.includes(b.status));

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await bookingService.cancel(cancelTarget);
      toast.success('Booking cancelled');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
    setCancelTarget(null);
  };

  if (isLoading) return <LoadingSpinner text="Loading bookings..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {bookings.filter((b) => tab.statuses.includes(b.status)).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No bookings found" description={`You have no ${activeTab} bookings.`} icon={ShoppingBag} />
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const merchant = booking.merchant;
            const serviceRequest = booking.service_request || booking.serviceRequest;
            return (
              <div key={booking.id} className="bg-white rounded-xl border p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-700">
                        {merchant?.business_name?.[0] || 'W'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{merchant?.business_name || 'Worker'}</p>
                      <p className="text-sm text-gray-500">{serviceRequest?.title || 'Service'}</p>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>NPR {Number(booking.agreed_rate).toLocaleString()}</span>
                  {booking.started_at && <span>Started {new Date(booking.started_at).toLocaleDateString()}</span>}
                  {booking.scheduled_at && !booking.started_at && <span>Scheduled {new Date(booking.scheduled_at).toLocaleDateString()}</span>}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <button onClick={() => navigate(`/customer/bookings/${booking.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="h-4 w-4" /> View Details
                  </button>
                  {['accepted', 'in_progress'].includes(booking.status) && (
                    <button onClick={() => setCancelTarget(booking.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                      <XCircle className="h-4 w-4" /> Cancel
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <button onClick={() => navigate(`/customer/reviews?booking=${booking.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-yellow-600 hover:bg-yellow-50 rounded-lg">
                      <Star className="h-4 w-4" /> Leave Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmLabel="Yes, Cancel"
      />
    </div>
  );
}