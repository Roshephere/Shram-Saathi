import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../api/categoryService';
import { requestService } from '../../api/requestService';
import { userService } from '../../api/userService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { MapPin, Navigation } from 'lucide-react';

export default function CreateRequest() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [locationMode, setLocationMode] = useState('saved');
  const [form, setForm] = useState({
    category_id: '',
    title: '',
    description: '',
    budget_min: '',
    budget_max: '',
    urgency: '2',
    location_text: '',
    latitude: '',
    longitude: '',
    user_location_id: '',
  });

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const [cats, locs] = await Promise.allSettled([
        categoryService.getAvailable(),
        userService.getLocations(),
      ]);
      if (cats.status === 'fulfilled') setCategories(Array.isArray(cats.value) ? cats.value : []);
      if (locs.status === 'fulfilled') setLocations(Array.isArray(locs.value) ? locs.value : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: String(pos.coords.latitude),
          longitude: String(pos.coords.longitude),
          location_text: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        }));
        toast.success('Location detected');
      },
      () => toast.error('Could not get current location. Enter manually.'),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let userLocationId = form.user_location_id;

      if (locationMode === 'custom') {
        if (!form.latitude || !form.longitude) {
          toast.error('Please enter latitude and longitude for your location');
          setSubmitting(false);
          return;
        }
        const newLoc = await userService.createLocation({
          label: form.location_text || 'Custom Location',
          country: 'NP',
          address: form.location_text || '',
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          is_primary: locations.length === 0,
        });
        userLocationId = newLoc?.id || newLoc?.data?.id;
        if (!userLocationId) {
          toast.error('Failed to save location');
          setSubmitting(false);
          return;
        }
      }

      if (!userLocationId) {
        toast.error(
          locationMode === 'saved'
            ? 'Please select a saved location'
            : 'Please enter your location details',
        );
        setSubmitting(false);
        return;
      }

      const created = await requestService.create({
        ...form,
        budget_min: form.budget_min ? Number(form.budget_min) : null,
        budget_max: form.budget_max ? Number(form.budget_max) : null,
        urgency: String(form.urgency),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        user_location_id: Number(userLocationId),
        category_id: Number(form.category_id),
        currency: 'INR',
      });
      const requestId = created?.id ?? created?.data?.id;
      toast.success('Service request created!');
      navigate(`/customer/requests/${requestId}/bids`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create request';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading form..." />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Service Request</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g., Need a plumber for pipe repair" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Describe your service needs..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget (NPR) *</label>
            <input required type="number" min="0" value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget (NPR) *</label>
            <input required type="number" min="0" value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
          <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
            {['1', '2', '3', '4', '5'].map((u) => (
              <option key={u} value={u}>Level {u} {u <= '2' ? '(Low)' : u === '3' ? '(Medium)' : u === '4' ? '(Urgent)' : '(Emergency)'}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="locationMode" value="saved"
                checked={locationMode === 'saved'}
                onChange={() => setLocationMode('saved')} />
              Use saved location
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="locationMode" value="custom"
                checked={locationMode === 'custom'}
                onChange={() => setLocationMode('custom')} />
              Enter custom location
            </label>
          </div>

          {locationMode === 'saved' ? (
            locations.length > 0 ? (
              <select value={form.user_location_id} onChange={(e) => {
                const loc = locations.find((l) => String(l.id) === e.target.value);
                setForm({
                  ...form,
                  user_location_id: e.target.value,
                  location_text: loc?.address || loc?.label || '',
                  latitude: loc?.latitude || '',
                  longitude: loc?.longitude || '',
                });
              }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">Select a saved location</option>
                {locations.map((l) => <option key={l.id} value={l.id}>{l.label || l.address || `Location #${l.id}`}</option>)}
              </select>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                No saved locations. Switch to "Enter custom location" to add one.
              </div>
            )
          ) : (
            <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
              <button type="button" onClick={getCurrentLocation}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                <Navigation className="h-4 w-4" />
                Get Current Location
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Latitude *</label>
                  <input type="number" step="any" required value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="27.7172" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Longitude *</label>
                  <input type="number" step="any" required value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="85.3240" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Address / Label</label>
                <input type="text" value={form.location_text}
                  onChange={(e) => setForm({ ...form, location_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="e.g., Kathmandu, Nepal" />
              </div>
              <p className="text-xs text-gray-400">
                This location will be saved to your account for future use.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Request'}
          </button>
          <button type="button" onClick={() => navigate('/customer/service-requests')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
