import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Wrench, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

export default function MerchantRegisterStep1() {
  const { setRegistrationStep } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const strength = form.password.length >= 12 ? 'strong' : form.password.length >= 8 ? 'medium' : 'weak';
  const strengthColors = { weak: 'bg-red-500', medium: 'bg-yellow-500', strong: 'bg-green-500' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await apiClient.post('/worker/register/step1', form);
      const body = res.data;
      const result = body.data || body;

      setRegistrationStep(1);

      if (result.token) {
        localStorage.setItem('auth_token', result.token);
      }

      const userId = result.user_id;
      if (userId) {
        navigate(`/auth/merchant/register/step2/${userId}`);
      } else {
        toast.success('Step 1 complete!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-green-600">
            <Wrench className="h-7 w-7" /> Shram-Saathi
          </Link>
          <p className="mt-1 text-green-700 font-medium text-sm">Service Provider Registration</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 1/3</span>
            <span className="text-xs text-gray-500">Account Creation</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{width: '33%'}} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="John Doe" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="merchant@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="98XXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={form.password} minLength={8}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${strengthColors[strength]} transition-all`} style={{width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%'}} />
                </div>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{strength}</p>
              </div>
            )}
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
            <input type="password" required value={form.password_confirmation} minLength={8}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`} placeholder="Repeat password" />
            {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
            {loading ? 'Creating account...' : 'Next →'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/auth/merchant/login" className="text-green-600 hover:underline font-medium">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
