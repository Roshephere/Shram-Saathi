import { useState, useEffect } from 'react';
import { categoryService } from '../../api/categoryService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', is_active: true, order: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load categories');
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', description: '', is_active: true, order: 0 });
    setEditModal(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug || '', description: cat.description || '', is_active: cat.is_active, order: cat.order || 0 });
    setEditModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await categoryService.update(editingId, form);
        toast.success('Category updated');
      } else {
        await categoryService.create(form);
        toast.success('Category created');
      }
      setEditModal(false);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await categoryService.delete(deleteTarget.id);
      toast.success('Category deleted');
      setCategories(categories.filter((c) => c.id !== deleteTarget.id));
    } catch {
      toast.error('Delete failed');
    }
    setDeleteTarget(null);
  };

  if (loading) return <LoadingSpinner text="Loading categories..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadCategories} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories" description="Create your first service category." icon={Briefcase} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  {cat.slug && <p className="text-xs text-gray-400 mt-0.5">/{cat.slug}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(cat)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {cat.description && <p className="mt-2 text-sm text-gray-500 line-clamp-2">{cat.description}</p>}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className={cat.is_active ? 'text-green-600' : 'text-red-600'}>
                  {cat.is_active ? 'Active' : 'Inactive'}
                </span>
                {cat.order > 0 && <span className="text-gray-400">· Order: {cat.order}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={editModal} onClose={() => setEditModal(false)} title={editingId ? 'Edit Category' : 'Create Category'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
              Active
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input type="number" min="0" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setEditModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
            {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Category" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} confirmLabel="Delete" />
    </div>
  );
}
