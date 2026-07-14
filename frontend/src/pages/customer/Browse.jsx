import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { categoryService } from '../../api/categoryService';
import { recommendationService } from '../../api/recommendationService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import MerchantCard from '../../components/ui/MerchantCard';
import LocationPicker from '../../components/ui/LocationPicker';
import { Search, Users, MapPin, Star, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const NEPAL_CENTER = [27.7172, 85.3240];

const userIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:22px;height:22px;background:#4f46e5;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const workerIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:22px;height:22px;background:#16a34a;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [markers, map]);
  return null;
}

export default function Browse() {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [searchParams, setSearchParams] = useState(null);

  const { data: categories = [] } = useQuery({
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

  const handleLocationChange = ({ latitude: lat, longitude: lng }) => {
    setLatitude(lat != null ? String(lat) : '');
    setLongitude(lng != null ? String(lng) : '');
  };

  const handleSelectMerchant = (merchant) => {
    const params = new URLSearchParams();
    if (searchParams?.categoryId) params.set('category', searchParams.categoryId);
    if (merchant.merchant_id) params.set('merchant', merchant.merchant_id);
    if (merchant.business_name) params.set('merchant_name', merchant.business_name);
    navigate(`/customer/service-requests/create?${params.toString()}`);
  };

  const handleNewSearch = () => {
    setSearchParams(null);
  };

  const hasResults = searchParams && !workersLoading;

  const mapMarkers = useMemo(() => {
    const markers = [];
    if (latitude && longitude) {
      markers.push({ lat: Number(latitude), lng: Number(longitude), type: 'user' });
    }
    workers.forEach((w) => {
      const lat = Number(w.location?.latitude);
      const lng = Number(w.location?.longitude);
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        markers.push({ lat, lng, type: 'worker', worker: w });
      }
    });
    return markers;
  }, [latitude, longitude, workers]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Browse Workers</h1>

      {/* Search Form */}
      {!hasResults && (
        <form onSubmit={handleSearch} className="bg-white rounded-xl border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Category *</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <LocationPicker
            label="Your Location (optional — helps find nearby workers)"
            value={latitude && longitude ? { lat: latitude, lng: longitude } : null}
            onChange={handleLocationChange}
            height="240px"
            placeholder="Search your area to find nearby workers..."
          />

          {latitude && longitude && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              Searching near: {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
            </div>
          )}

          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
            <Search className="h-4 w-4" />
            Find Workers
          </button>
        </form>
      )}

      {workersLoading && <LoadingSpinner text="Finding workers..." />}
      {workersError && <ErrorMessage message={workersError.message} onRetry={refetch} />}

      {/* Results */}
      {hasResults && !workersLoading && (
        <>
          <div className="flex items-center gap-3">
            <button onClick={handleNewSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-4 w-4" /> New Search
            </button>
            <span className="text-sm text-gray-500">
              {workers.length} worker{workers.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Single Map with all markers */}
          {mapMarkers.length > 0 && (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Map View</h2>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span> You
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block"></span> Worker
                  </span>
                </div>
              </div>
              <div style={{ height: '400px' }}>
                <MapContainer
                  center={mapMarkers.length > 0 ? [mapMarkers[0].lat, mapMarkers[0].lng] : NEPAL_CENTER}
                  zoom={mapMarkers.length === 1 ? 14 : 12}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FitBounds markers={mapMarkers} />
                  {mapMarkers.map((m, i) => (
                    <Marker key={i} position={[m.lat, m.lng]} icon={m.type === 'user' ? userIcon : workerIcon}>
                      <Popup>
                        {m.type === 'user' ? (
                          <span className="font-medium">Your Location</span>
                        ) : (
                          <div className="min-w-[180px]">
                            <p className="font-semibold text-gray-900">{m.worker.business_name}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              {m.worker.avg_rating ? Number(m.worker.avg_rating).toFixed(1) : 'N/A'}
                              <span className="mx-1">·</span>
                              {m.worker.distance_km ?? '?'} km
                            </div>
                            {m.worker.hourly_rate && (
                              <p className="text-sm text-gray-600 mt-0.5">
                                NPR {Number(m.worker.hourly_rate).toLocaleString()}/hr
                              </p>
                            )}
                            <button
                              onClick={() => handleSelectMerchant(m.worker)}
                              className="mt-2 w-full py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                            >
                              Request Service
                            </button>
                          </div>
                        )}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}

          {workers.length === 0 ? (
            <EmptyState title="No workers found" description="Try a different category or location." icon={Users} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((w) => (
                <MerchantCard
                  key={w.merchant_id || w.id}
                  merchant={w}
                  onSelect={handleSelectMerchant}
                  selectLabel="Request Service"
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
