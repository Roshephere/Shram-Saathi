import { useState } from 'react';
import { categoryService } from '../../api/categoryService';
import { recommendationService } from '../../api/recommendationService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import MerchantCard from '../../components/ui/MerchantCard';
import { Search, MapPin, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function Browse() {
  const [categoryId, setCategoryId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [searchParams, setSearchParams] = useState(null);

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ['available-categories'],
    queryFn: () => categoryService.getAvailable().then((d) => Array.isArray(d) ? d : []),
  });

  const { data: workers = [], isLoading: workersLoading, error: workersError, refetch } = useQuery({
    queryKey: ['browse-workers', searchParams],
    queryFn: () => recommendationService.getByCategory(searchParams.categoryId, {
      latitude: searchParams.latitude || undefined,
      longitude: searchParams.longitude || undefined,
      limit: 20,
    }).then((d) => Array.isArray(d) ? d : []),
    enabled: !!searchParams,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }
    setSearchParams({ categoryId, latitude, longitude });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Browse Workers</h1>

      <form onSubmit={handleSearch} className="bg-white rounded-xl border p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Category *</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="27.7172" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="85.3240" />
          </div>
        </div>
        <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
          <Search className="h-4 w-4" />
          Find Workers
        </button>
      </form>

      {workersLoading && <LoadingSpinner text="Finding workers..." />}
      {workersError && <ErrorMessage message={workersError.message} onRetry={refetch} />}

      {!workersLoading && searchParams && workers.length === 0 && (
        <EmptyState title="No workers found" description="Try a different category or location." icon={Users} />
      )}

      {workers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((w) => (
            <MerchantCard key={w.id} merchant={w} selectLabel="View Profile" />
          ))}
        </div>
      )}
    </div>
  );
}
