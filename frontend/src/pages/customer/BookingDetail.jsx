import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../../api/bookingService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import { ArrowLeft, DollarSign, User, FileText, Star, MapPin, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import PaymentSection from '../../components/ui/PaymentSection';

const STEPS = ['pending', 'accepted', 'in_progress', 'completed'];
const STEP_LABELS = { pending: 'Pending', accepted: 'Accepted', in_progress: 'In Progress', completed: 'Completed' };

function StatusTimeline({ current }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-1 mt-4">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold
              ${i <= idx ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < idx ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-xs mt-1 ${i <= idx ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
              {STEP_LABELS[step]}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 rounded ${i < idx ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CustomerBookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: booking, isLoading, error, refetch } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getById(bookingId),
    refetchInterval: 30000,
  });

  const handleCancel = async () => {
    try {
      await bookingService.cancel(bookingId);
      toast.success('Booking cancelled');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
    setCancelOpen(false);
  };

  if (isLoading) return <LoadingSpinner text="Loading booking..." />;
  if (error) return <ErrorMessage message="Failed to load booking" onRetry={refetch} />;
  if (!booking) return <ErrorMessage message="Booking not found" />;

  const merchant = booking.merchant;
  const serviceRequest = booking.service_request || booking.serviceRequest;
  const location = booking.location || serviceRequest?.location;
  const canCancel = ['accepted', 'in_progress'].includes(booking.status);
  const canReview = booking.status === 'completed';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/customer/bookings')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to Bookings
      </button>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Booking #{booking.id}</h1>
            <p className="text-sm text-gray-500 mt-1">Created {new Date(booking.created_at).toLocaleDateString()}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <StatusTimeline current={booking.status} />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><User className="h-4 w-4" /> Worker</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{merchant?.business_name || 'Worker'}</p>
              {merchant?.avg_rating && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  {Number(merchant.avg_rating).toFixed(1)} ({merchant.review_count || 0} reviews)
                </p>
              )}
              {merchant?.phone && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <span>{merchant.phone}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Details</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Agreed Rate</span>
                <span className="font-medium text-gray-900">NPR {Number(booking.agreed_rate).toLocaleString()}</span>
              </div>
              {booking.scheduled_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Scheduled</span>
                  <span className="font-medium text-gray-900">{new Date(booking.scheduled_at).toLocaleDateString()}</span>
                </div>
              )}
              {booking.started_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Started</span>
                  <span className="font-medium text-gray-900">{new Date(booking.started_at).toLocaleDateString()}</span>
                </div>
              )}
              {booking.completed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium text-gray-900">{new Date(booking.completed_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {location && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" /> Location</h2>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
              {location.address || `${location.latitude}, ${location.longitude}`}
            </div>
          </div>
        )}

        {booking.special_notes && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-2"><FileText className="h-4 w-4" /> Notes</h2>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{booking.special_notes}</p>
          </div>
        )}

        {serviceRequest && (
          <div className="mt-6 pt-4 border-t">
            <h2 className="font-semibold text-gray-900 mb-2">Service Request</h2>
            <button onClick={() => navigate(`/customer/service-requests/${serviceRequest.id}`)}
              className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> {serviceRequest.title || `Request #${serviceRequest.id}`}
            </button>
          </div>
        )}

        {booking.status === 'completed' && (
          <PaymentSection bookingId={booking.id} role="customer" />
        )}

        {booking.status === 'completed' && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Work completed! Leave a review to help others.</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {canCancel && (
          <button onClick={() => setCancelOpen(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
            Cancel Booking
          </button>
        )}
        {canReview && (
          <button onClick={() => navigate(`/customer/reviews?booking=${booking.id}`)}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm">
            <Star className="h-4 w-4" /> Leave Review
          </button>
        )}
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This cannot be undone."
        confirmLabel="Yes, Cancel"
      />
    </div>
  );
}
