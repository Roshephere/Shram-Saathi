import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { merchantService } from '../../api/merchantService';
import { merchantLocationService } from '../../api/merchantLocationService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { MapPin, Plus, Edit2, Trash2, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MerchantProfile() {
  const { user } = useAuth();
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    business_name: '', phone: '', location: '', hourly_rate: '', pan_no: '',
  });

  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locForm, setLocForm] = useState({ label: '', address: '', country: 'NP', latitude: '', longitude: '', is_primary: false });
  const [locSaving, setLocSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadMerchant();
  }, []);

  const loadMerchant = async () => {
    setLoading(true);
    try {
      const data = await merchantService.getAll();
      const list = Array.isArray(data) ? data : [];
      const mine = list.find((m) => m.user_id === user?.id);
      if (mine) {
        setMerchant(mine);
        setForm({
          business_name: mine.business_name || '',
          phone: mine.phone || '',
          location: mine.location || '',
          hourly_rate: mine.hourly_rate || '',
          pan_no: mine.pan_no || '',
        });
        loadLocations(mine.id);
      }
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async (merchantId) => {
    setLocationsLoading(true);
    try {
      const data = await merchantLocationService.getAll();
      const all = Array.isArray(data) ? data : [];
      setLocations(all.filter((l) => l.merchant_id === merchantId));
    } catch {
      setLocations([]);
    } finally {
      setLocationsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!merchant) return;
    setSaving(true);
    try {
      const updated = await merchantService.update(merchant.id, form);
      toast.success('Profile updated!');
      setMerchant(updated.merchant || updated);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const openAddLocation = () => {
    setEditingLocation(null);
    setLocForm({ label: '', address: '', country: 'NP', latitude: '', longitude: '', is_primary: locations.length === 0 });
    setLocationModal(true);
  };

  const openEditLocation = (loc) => {
    setEditingLocation(loc);
    setLocForm({
      label: loc.label || '',
      address: loc.address || '',
      country: loc.country || 'NP',
      latitude: String(loc.latitude || ''),
      longitude: String(loc.longitude || ''),
      is_primary: loc.is_primary || false,
    });
    setLocationModal(true);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocForm((prev) => ({
          ...prev,
          latitude: String(pos.coords.latitude),
          longitude: String(pos.coords.longitude),
          address: prev.address || `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        }));
        toast.success('Location detected');
      },
      () => toast.error('Could not get current location'),
    );
  };

  const handleLocSubmit = async (e) => {
    e.preventDefault();
    if (!merchant) return;
    setLocSaving(true);
    try {
      const payload = {
        merchant_id: merchant.id,
        ...locForm,
        latitude: Number(locForm.latitude),
        longitude: Number(locForm.longitude),
        is_primary: Boolean(locForm.is_primary),
      };

      if (editingLocation) {
        await merchantLocationService.update(editingLocation.id, payload);
        toast.success('Location updated');
      } else {
        await merchantLocationService.create(payload);
        toast.success('Location added');
      }
      setLocationModal(false);
      loadLocations(merchant.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save location');
    } finally {
      setLocSaving(false);
    }
  };

  const handleDeleteLocation = async () => {
    if (!deleteTarget) return;
    try {
      await merchantLocationService.delete(deleteTarget.id);
      toast.success('Location deleted');
      setDeleteTarget(null);
      loadLocations(merchant.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete location');
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadMerchant} />;

  if (!merchant) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900">No merchant profile found</h2>
        <p className="text-gray-500 mt-2">Please complete merchant registration first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Merchant Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input type="text" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
          <input type="text" value={form.pan_no} onChange={(e) => setForm({ ...form, pan_no: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location (Text)</label>
          <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g., Kathmandu, Nepal" />
          <p className="text-xs text-gray-400 mt-1">A general address for your business. Add precise locations below.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (NPR)</label>
          <input type="number" min="0" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Service Locations</h2>
          </div>
          <button onClick={openAddLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50">
            <Plus className="h-4 w-4" /> Add Location
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Your precise service locations are used for worker matching and distance-based recommendations.
        </p>

        {locationsLoading ? (
          <LoadingSpinner size="sm" text="Loading locations..." />
        ) : locations.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
            <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">No locations added yet</p>
            <p className="text-xs text-gray-400 mt-1">Add your service area locations to get discovered by customers.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {locations.map((loc) => (
              <div key={loc.id} className="flex items-start justify-between bg-gray-50 rounded-lg p-4 border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{loc.label}</p>
                    {loc.is_primary && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Primary</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{loc.address}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {loc.country} &middot; {Number(loc.latitude).toFixed(4)}, {Number(loc.longitude).toFixed(4)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button onClick={() => openEditLocation(loc)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(loc)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={locationModal} onClose={() => setLocationModal(false)}
        title={editingLocation ? 'Edit Location' : 'Add Location'} size="md">
        <form onSubmit={handleLocSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
            <input type="text" required value={locForm.label} onChange={(e) => setLocForm({ ...locForm, label: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Main Office, Branch 1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input type="text" required value={locForm.address} onChange={(e) => setLocForm({ ...locForm, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Kathmandu, Nepal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <input type="text" required value={locForm.country} onChange={(e) => setLocForm({ ...locForm, country: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button type="button" onClick={getCurrentLocation}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
            <Navigation className="h-4 w-4" /> Get Current Location
          </button>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
              <input type="number" step="any" required value={locForm.latitude}
                onChange={(e) => setLocForm({ ...locForm, latitude: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
              <input type="number" step="any" required value={locForm.longitude}
                onChange={(e) => setLocForm({ ...locForm, longitude: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={locForm.is_primary} onChange={(e) => setLocForm({ ...locForm, is_primary: e.target.checked })} />
            Set as primary location
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setLocationModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={locSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {locSaving ? 'Saving...' : editingLocation ? 'Update Location' : 'Add Location'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteLocation}
        title="Delete Location"
        message={`Remove "${deleteTarget?.label || 'this location'}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}