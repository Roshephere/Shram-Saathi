import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, FileText, PlusCircle, Search, Users, UserCheck,
  Settings, Briefcase, Star, LogOut, Menu, X, Wrench, ShoppingBag,
  DollarSign, User,
} from 'lucide-react';

const navConfig = {
  customer: {
    items: [
      { label: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
      { label: 'Browse Workers', path: '/customer/browse', icon: Search },
      { label: 'My Requests', path: '/customer/service-requests', icon: FileText },
      { label: 'Create Request', path: '/customer/service-requests/create', icon: PlusCircle },
      { label: 'Bookings', path: '/customer/bookings', icon: ShoppingBag },
      { label: 'My Reviews', path: '/customer/reviews', icon: Star },
      { label: 'Profile', path: '/customer/profile', icon: User },
    ],
  },
  worker: {
    items: [
      { label: 'Dashboard', path: '/merchant/dashboard', icon: LayoutDashboard },
      { label: 'Available Requests', path: '/merchant/requests/available', icon: FileText },
      { label: 'Profile', path: '/merchant/profile', icon: Settings },
      { label: 'Services', path: '/merchant/services', icon: Briefcase },
      { label: 'My Bids & Jobs', path: '/merchant/jobs', icon: ShoppingBag },
      { label: 'Earnings', path: '/merchant/earnings', icon: DollarSign },
      { label: 'Reviews', path: '/merchant/reviews', icon: Star },
    ],
  },
  admin: {
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Users', path: '/admin/users', icon: Users },
      { label: 'Merchants', path: '/admin/merchants', icon: UserCheck },
      { label: 'Categories', path: '/admin/service-categories', icon: Briefcase },
      { label: 'Requests', path: '/admin/service-requests', icon: FileText },
      { label: 'Bookings', path: '/admin/bookings', icon: ShoppingBag },
      { label: 'Reviews', path: '/admin/reviews', icon: Star },
      { label: 'Transactions', path: '/admin/transactions', icon: DollarSign },
    ],
  },
};

export default function DashboardLayout({ children }) {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = navConfig[role]?.items || [];

  const handleLogout = async () => {
    await logout();
    navigate('/auth/choose');
  };

  const roleLabel = role === 'worker' ? 'Worker' : role === 'admin' ? 'Admin' : 'Customer';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-blue-600">
            <Wrench className="h-5 w-5" />
            Shram-Saathi
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{roleLabel}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {user?.name?.[0] || 'U'}
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600" title="Logout">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
