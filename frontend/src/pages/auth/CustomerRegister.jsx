import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Wrench, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerRegister() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '', terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Passwords do not match';
    if (!form.terms) errs.terms = 'You must agree to terms';
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
      await register(form);
      const loginRes = await login(form.email, form.password);
      toast.success('Account created!');
      navigate(loginRes.user?.role === 'worker' ? '/merchant/dashboard' : '/customer/dashboard');
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message || Object.values(data?.errors || {}).flat()[0] || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Wrench className="h-7 w-7" /> Shram-Saathi
          </Link>
          <p className="mt-2 text-gray-500">Customer Registration</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="John Doe" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="98XXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={form.password} minLength={8}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Min. 8 characters" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" required value={form.password_confirmation} minLength={8}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`} placeholder="Repeat password" />
            {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
          </div>
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="mt-0.5 rounded" />
            I agree to the Terms & Conditions
          </label>
          {errors.terms && <p className="text-xs text-red-500 -mt-3">{errors.terms}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/auth/customer/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
