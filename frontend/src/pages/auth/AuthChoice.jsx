import { Link } from 'react-router-dom';
import { Wrench, User, Briefcase, Shield } from 'lucide-react';

export default function AuthChoice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-3xl font-bold text-blue-600 mb-3">
            <Wrench className="h-8 w-8" />
            Shram-Saathi
          </div>
          <p className="text-lg text-gray-500">Choose how you want to use the platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/auth/customer/login"
            className="group bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-blue-400 hover:shadow-lg transition-all">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a Customer</h2>
            <p className="text-sm text-gray-500">Find skilled workers for your service needs</p>
          </Link>

          <Link to="/auth/merchant/login"
            className="group bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-blue-400 hover:shadow-lg transition-all">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a Service Provider</h2>
            <p className="text-sm text-gray-500">Offer your services and grow your business</p>
          </Link>
        </div>

        <div className="mt-8">
          <Link to="/auth/admin/login" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
