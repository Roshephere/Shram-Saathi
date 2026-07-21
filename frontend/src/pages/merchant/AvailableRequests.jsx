import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { requestService } from '../../api/requestService';
import { bookingService } from '../../api/bookingService';
import { categoryService } from '../../api/categoryService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import { Search, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react';

export default function AvailableRequests() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ category_id: '', urgency: '' });

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ['available-categories'],
    queryFn: () => categoryService.getAvailable().then((d) => Array.isArray(d) ? d : []),
  });

  const { data: myActiveBids = [] } = useQuery({
    queryKey: ['merchant-active-bids'],
    queryFn: () => bookingService.merchantBookings({ status: 'bidding' })
      .then((r) => Array.isArray(r.data) ? r.data : []),
  });

  const biddedRequestIds = useMemo(() => {
    return new Set(myActiveBids.map((b) => b.service_request_id));
  }, [myActiveBids]);

  const queryParams = {};
  if (filters.category_id) queryParams.category_id = filters.category_id;
  if (filters.urgency) queryParams.urgency = filters.urgency;

  const { data: requests = [], isLoading, error, refetch } = useQuery({
    queryKey: ['available-requests', filters],
    queryFn: () => requestService.getAvailableRequests(queryParams).then((d) => Array.isArray(d) ? d : []),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Available Service Requests</h1>

      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="min-w-[200px] flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select value={filters.urgency} onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
              <option value="">Any Urgency</option>
              {[1, 2, 3, 4, 5].map((u) => (
                <option key={u} value={u}>Level {u}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner text="Loading requests..." />}
      {error && <ErrorMessage message={error.message} onRetry={refetch} />}

      {!isLoading && requests.length === 0 ? (
        <EmptyState title="No open requests" description="There are no service requests matching your criteria." />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} onClick={() => navigate(`/merchant/requests/${req.id}/details`)}
              className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{req.title || 'Untitled'}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{req.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {biddedRequestIds.has(req.id) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3" /> Bidded
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {req.status}
                    </span>
                  </div>
                </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-600">
                {req.category && (
                  <span className="flex items-center gap-1">
                    <Search className="h-3.5 w-3.5" /> {req.category.name || req.category}
                  </span>
                )}
                {req.budget_min && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" /> NPR {Number(req.budget_min).toLocaleString()}{req.budget_max ? ` - ${Number(req.budget_max).toLocaleString()}` : ''}
                  </span>
                )}
                {req.urgency && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Urgency Level {req.urgency}
                  </span>
                )}
                {req.location_text && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {req.location_text}
                  </span>
                )}
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Posted {new Date(req.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}