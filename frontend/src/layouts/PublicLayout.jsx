import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <Wrench className="h-6 w-6" />
            Shram-Saathi
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
            <Link to="/register" className="text-sm font-medium px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Register</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
