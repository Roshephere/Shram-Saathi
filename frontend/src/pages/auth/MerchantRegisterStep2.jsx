import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { categoryService } from '../../api/categoryService';
import { Wrench } from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

export default function MerchantRegisterStep2() {
  const { userId } = useParams();
  const { setRegistrationStep } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categoryRates, setCategoryRates] = useState({});
  const [form, setForm] = useState({ business_name: '', phone: '', pan_no: '', description: '' });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    categoryService.getAvailable().then((data) => {
      const cats = Array.isArray(data) ? data : [];
      setCategories(cats);
      setLoadingCats(false);
    }).catch(() => setLoadingCats(false));
  }, []);

  const toggleCategory = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.business_name.trim()) {
      toast.error('Business name is required');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('business_name', form.business_name);
      if (form.phone) formData.append('phone', form.phone);
      if (form.pan_no) formData.append('pan_no', form.pan_no);
      if (form.description) formData.append('description', form.description);
      if (logo) formData.append('logo', logo);
      selectedCategoryIds.forEach((id) => {
        formData.append('service_category_ids[]', id);
        const rate = categoryRates[id];
        if (rate) formData.append(`base_rates[${id}]`, rate);
      });

      await apiClient.post(`/worker/register/step2/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRegistrationStep(2);

      const merchantsRes = await apiClient.get('/merchants');
      const merchants = Array.isArray(merchantsRes.data) ? merchantsRes.data : [];
      const myMerchant = merchants.find((m) => m.user_id === Number(userId));
      if (myMerchant) {
        navigate(`/auth/merchant/register/step3/${myMerchant.id}`);
      } else {
        toast.success('Step 2 complete! Redirecting...');
        navigate('/auth/merchant/register');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-green-600">
            <Wrench className="h-7 w-7" /> Shram-Saathi
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 2/3</span>
            <span className="text-xs text-gray-500">Profile Setup</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{width: '66%'}} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-5">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-20 w-20 rounded-full object-cover border" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400 text-xs">Logo</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input type="text" required value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="My Business" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input type="text" value={form.pan_no} onChange={(e) => setForm({ ...form, pan_no: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" rows={3}
              placeholder="Tell us about your business, experience, and skills..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Categories</label>
            {loadingCats ? (
              <p className="text-sm text-gray-400">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-400">No categories available</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" checked={selectedCategoryIds.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)} className="rounded" />
                    <span className="text-sm flex-1">{cat.name}</span>
                    {selectedCategoryIds.includes(cat.id) && (
                      <input type="number" placeholder="Rate" value={categoryRates[cat.id] || ''}
                        onChange={(e) => setCategoryRates({ ...categoryRates, [cat.id]: e.target.value })}
                        className="w-24 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-green-500 outline-none" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/auth/merchant/register')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
              ← Back
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Next →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
