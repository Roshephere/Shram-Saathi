import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../../api/bookingService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import StatusBadge from '../../components/ui/StatusBadge';
import { ArrowLeft, DollarSign, Calendar, User, FileText, Star, Clock, Play, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MerchantBookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: booking, isLoading, error, refetch } = useQuery({
    queryKey: ['merchant-booking', bookingId],
    queryFn: () => bookingService.getById(bookingId),
  });

  const doAction = async (action) => {
    try {
      if (action === 'start') {
        await bookingService.start(bookingId);
        toast.success('Work started!');
      } else if (action === 'complete') {
        await bookingService.complete(bookingId);
        toast.success('Work marked as complete!');
      }
      refetch();
      queryClient.invalidateQueries({ queryKey: ['merchantBookings'] });
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} work`);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading booking..." />;
  if (error) return <ErrorMessage message="Failed to load booking" onRetry={refetch} />;
  if (!booking) return <ErrorMessage message="Booking not found" />;

  const customer = booking.customer;
  const serviceRequest = booking.service_request || booking.serviceRequest;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/merchant/jobs')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </button>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Booking #{booking.id}</h1>
            <p className="text-sm text-gray-500 mt-1">{serviceRequest?.title || 'Service Request'}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><User className="h-4 w-4" /> Customer</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{customer?.name || 'Customer'}</p>
              {customer?.phone && <p className="text-sm text-gray-500 mt-1">{customer.phone}</p>}
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
                  <span className="text-gray-500">Estimated completion</span>
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

        {booking.special_notes && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-2"><FileText className="h-4 w-4" /> Your Message</h2>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{booking.special_notes}</p>
          </div>
        )}

        {serviceRequest && (
          <div className="mt-6 pt-4 border-t">
            <h2 className="font-semibold text-gray-900 mb-2">Service Request Details</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{serviceRequest.title}</p>
              {serviceRequest.description && <p className="text-sm text-gray-600 mt-1">{serviceRequest.description}</p>}
              {serviceRequest.location_text && <p className="text-sm text-gray-500 mt-1">{serviceRequest.location_text}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {booking.status === 'accepted' && (
          <button onClick={() => doAction('start')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <Play className="h-4 w-4" /> Start Work
          </button>
        )}
        {booking.status === 'in_progress' && (
          <button onClick={() => doAction('complete')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
            <CheckCircle className="h-4 w-4" /> Mark Complete
          </button>
        )}
        {booking.status === 'completed' && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Completed on {new Date(booking.completed_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}