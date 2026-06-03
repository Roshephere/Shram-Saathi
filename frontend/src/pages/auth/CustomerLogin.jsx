import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Wrench, Eye, EyeOff, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [usePhone, setUsePhone] = useState(false);
  const [form, setForm] = useState({ email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email || form.phone, form.password);
      toast.success('Welcome back!');
      const role = res.user?.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'worker') navigate('/merchant/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Wrench className="h-7 w-7" />
            Shram-Saathi
          </Link>
          <p className="mt-2 text-gray-500">Customer Sign In</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-5">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button type="button" onClick={() => setUsePhone(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${!usePhone ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              <Mail className="h-4 w-4 inline mr-1" /> Email
            </button>
            {/* <button type="button" onClick={() => setUsePhone(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${usePhone ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              <Phone className="h-4 w-4 inline mr-1" /> Phone
            </button> */}
          </div>

          {usePhone ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="98XXXXXXXX" />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center space-y-2 text-sm">
            <p>Don't have an account? <Link to="/auth/customer/register" className="text-blue-600 hover:underline font-medium">Register</Link></p>
            <p><Link to="/auth/merchant/login" className="text-gray-500 hover:text-gray-700">Login as Merchant Instead?</Link></p>
            <p><Link to="/auth/choose" className="text-gray-400 hover:text-gray-600">Back to choice</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
