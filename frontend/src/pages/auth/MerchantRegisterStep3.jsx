import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Wrench, MapPin } from 'lucide-react';
import LocationPicker from '../../components/ui/LocationPicker';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

export default function MerchantRegisterStep3() {
  const { merchantId } = useParams();
  const { setRegistrationStep } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    label: 'Primary Location',
    country: 'Nepal',
    address: '',
    latitude: '',
    longitude: '',
    is_primary: true,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleLocationChange = ({ latitude, longitude, address }) => {
    setForm((prev) => ({
      ...prev,
      latitude: latitude != null ? String(latitude) : '',
      longitude: longitude != null ? String(longitude) : '',
      address: address || prev.address,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      toast.error('Location is required');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post(`/worker/register/step3/${merchantId}`, {
        label: form.label,
        country: form.country,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        is_primary: form.is_primary,
        is_active: form.is_active,
      });
      setRegistrationStep(3);
      toast.success('Registration complete! Welcome aboard!');
      navigate('/merchant/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-green-600">
            <Wrench className="h-7 w-7" /> Shram-Saathi
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 3/3</span>
            <span className="text-xs text-gray-500">Location Setup</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{width: '100%'}} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-5">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Set your service location</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Label *</label>
            <input type="text" required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Primary Location" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <input type="text" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Nepal" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address / Location Text *</label>
            <input type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Kathmandu, Nepal" />
          </div>

          <LocationPicker
            label="Select Location on Map"
            required
            value={form.latitude && form.longitude ? { lat: form.latitude, lng: form.longitude } : null}
            onChange={handleLocationChange}
            height="280px"
          />

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.is_primary} onChange={(e) => setForm({ ...form, is_primary: e.target.checked })} className="rounded" />
            Set as Primary Location
          </label>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
              ← Back
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
              {loading ? 'Completing...' : 'Complete Registration ✓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
