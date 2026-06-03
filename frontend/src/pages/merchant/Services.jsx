import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { merchantService } from '../../api/merchantService';
import { categoryService } from '../../api/categoryService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MerchantServices() {
  const { user } = useAuth();
  const [merchant, setMerchant] = useState(null);
  const [myServices, setMyServices] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addForm, setAddForm] = useState({
    service_category_ids: [],
    base_rate: '',
    experience_levels: '',
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await merchantService.getAll();
      const list = Array.isArray(data) ? data : [];
      const mine = list.find((m) => m.user_id === user?.id);
      setMerchant(mine || null);

      if (mine) {
        const [svc, cats] = await Promise.all([
          merchantService.getServiceCategories(mine.id),
          categoryService.getAvailable(),
        ]);
        setMyServices(Array.isArray(svc) ? svc : []);
        setAllCategories(Array.isArray(cats) ? cats : []);
      }
    } catch {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!addForm.service_category_ids.length) return;
    setAdding(true);
    try {
      await merchantService.attachServiceCategories(merchant.id, {
        service_category_ids: addForm.service_category_ids,
        base_rate: addForm.base_rate || null,
        experience_levels: addForm.experience_levels || null,
      });
      toast.success('Services added!');
      setShowAdd(false);
      setAddForm({ service_category_ids: [], base_rate: '', experience_levels: '' });
      const svc = await merchantService.getServiceCategories(merchant.id);
      setMyServices(Array.isArray(svc) ? svc : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add services');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await merchantService.detachServiceCategory(merchant.id, deleteTarget.id);
      toast.success('Service removed');
      setMyServices(myServices.filter((s) => s.id !== deleteTarget.id));
    } catch (err) {
      toast.error('Failed to remove service');
    }
    setDeleteTarget(null);
  };

  const available = allCategories.filter(
    (c) => !myServices.some((s) => s.id === c.id || s.pivot?.service_category_id === c.id)
  );

  if (loading) return <LoadingSpinner text="Loading services..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;
  if (!merchant) return <EmptyState title="No merchant profile" description="Complete registration first." icon={Briefcase} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <button onClick={() => setShowAdd(true)} disabled={!available.length}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {myServices.length === 0 ? (
        <EmptyState title="No services added" description="Add service categories you offer." icon={Briefcase} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myServices.map((svc) => (
            <div key={svc.id} className="bg-white rounded-lg border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{svc.name}</h3>
                  {svc.pivot?.base_rate && (
                    <p className="text-sm text-gray-600 mt-1">NPR {Number(svc.pivot.base_rate).toLocaleString()}</p>
                  )}
                  {svc.pivot?.experience_levels && (
                    <p className="text-xs text-gray-400 mt-0.5">{svc.pivot.experience_levels}</p>
                  )}
                </div>
                <button onClick={() => setDeleteTarget(svc)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add Services</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Categories</label>
                <select multiple value={addForm.service_category_ids}
                  onChange={(e) => setAddForm({ ...addForm, service_category_ids: Array.from(e.target.selectedOptions, (o) => Number(o.value)) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32">
                  {available.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate (NPR)</label>
                <input type="number" min="0" value={addForm.base_rate}
                  onChange={(e) => setAddForm({ ...addForm, base_rate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Levels (JSON string)</label>
                <input type="text" value={addForm.experience_levels}
                  onChange={(e) => setAddForm({ ...addForm, experience_levels: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder='["intermediate"]' />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} disabled={adding}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {adding ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Remove Service" message={`Remove "${deleteTarget?.name}" from your services?`} confirmLabel="Remove" />
    </div>
  );
}
