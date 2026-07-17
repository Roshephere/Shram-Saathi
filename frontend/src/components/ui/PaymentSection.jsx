import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../../api/bookingService';
import { DollarSign, CheckCircle, Clock, AlertCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentSection({ bookingId, role }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: transaction, error: transactionError, isLoading } = useQuery({
    queryKey: ['transaction', bookingId],
    queryFn: () => bookingService.getTransaction(bookingId),
    enabled: !!bookingId,
  });

  if (isLoading) return (
    <div className="mt-6 pt-4 border-t">
      <p className="text-sm text-gray-500">Loading payment info...</p>
    </div>
  );

  if (transactionError) return (
    <div className="mt-6 pt-4 border-t">
      <p className="text-sm text-red-500">Could not load payment info</p>
    </div>
  );

  if (!transaction) return null;

  const customerConfirmed = !!transaction.customer_confirmed_at;
  const merchantConfirmed = !!transaction.merchant_confirmed_at;
  const bothConfirmed = customerConfirmed && merchantConfirmed;
  const isPaid = transaction.status === 'completed';

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (role === 'customer') {
        await bookingService.confirmPayment(transaction.id);
        toast.success('Payment confirmed!');
      } else {
        await bookingService.receivePayment(transaction.id);
        toast.success('Payment received confirmed!');
      }
      queryClient.invalidateQueries({ queryKey: ['transaction', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm');
    }
    setLoading(false);
  };

  return (
    <div className="mt-6 pt-4 border-t">
      <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
        <DollarSign className="h-4 w-4" /> Payment Status
      </h2>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{role === 'customer' ? 'Total amount' : 'Service amount'}</span>
          <span className="font-medium text-gray-900">NPR {Number(transaction.service_amount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Platform fee ({transaction.commission_rate}%)</span>
          <span className="font-medium text-gray-900">NPR {Number(transaction.commission_amount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
          <span className="font-medium text-gray-700">{role === 'customer' ? 'You pay' : 'Your payout'}</span>
          <span className="font-bold text-gray-900">NPR {Number(transaction.merchant_amount).toLocaleString()}</span>
        </div>

        {/* Step 1: Customer confirms */}
        <div className="pt-3 space-y-2">
          <div className={`flex items-center gap-2 text-sm p-2 rounded-lg ${customerConfirmed ? 'bg-green-50' : role === 'customer' ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <div className="flex-shrink-0">
              {customerConfirmed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : role === 'customer' ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">1</span>
              ) : (
                <Clock className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <span className={customerConfirmed ? 'text-green-700 font-medium' : 'text-gray-600'}>
              Step 1 — Customer confirms payment
            </span>
            {customerConfirmed && (
              <span className="ml-auto text-xs text-green-600">
                {new Date(transaction.customer_confirmed_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Step 2: Merchant confirms */}
          <div className={`flex items-center gap-2 text-sm p-2 rounded-lg ${merchantConfirmed ? 'bg-green-50' : !customerConfirmed ? 'bg-gray-50 opacity-50' : role === 'merchant' ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <div className="flex-shrink-0">
              {merchantConfirmed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : !customerConfirmed ? (
                <Lock className="h-4 w-4 text-gray-300" />
              ) : role === 'merchant' ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">2</span>
              ) : (
                <Clock className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <span className={merchantConfirmed ? 'text-green-700 font-medium' : !customerConfirmed ? 'text-gray-400' : 'text-gray-600'}>
              Step 2 — Merchant confirms received
            </span>
            {merchantConfirmed && (
              <span className="ml-auto text-xs text-green-600">
                {new Date(transaction.merchant_confirmed_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Result */}
        {isPaid || bothConfirmed ? (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 mt-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Payment Complete</span>
          </div>
        ) : role === 'customer' && !customerConfirmed ? (
          <button onClick={handleConfirm} disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm">
            {loading ? 'Confirming...' : 'I\'ve Paid — Mark as Paid'}
          </button>
        ) : role === 'merchant' && customerConfirmed && !merchantConfirmed ? (
          <button onClick={handleConfirm} disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm">
            {loading ? 'Confirming...' : 'Payment Received'}
          </button>
        ) : role === 'merchant' && !customerConfirmed ? (
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded-lg p-3 mt-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Waiting for customer to confirm payment</span>
          </div>
        ) : role === 'customer' && customerConfirmed && !merchantConfirmed ? (
          <div className="flex items-center gap-2 text-blue-700 bg-blue-50 rounded-lg p-3 mt-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Waiting for merchant to confirm receipt</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
