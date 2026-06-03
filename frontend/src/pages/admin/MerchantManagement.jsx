import { useState, useEffect } from 'react';
import { merchantService } from '../../api/merchantService';
import apiClient from '../../api/client';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import StatusBadge from '../../components/ui/StatusBadge';
import { UserCheck, Shield, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'pending', label: 'Pending', icon: X },
  { key: 'active', label: 'Active', icon: Check },
  { key: 'suspended', label: 'Suspended', icon: Shield },
];

export default function MerchantManagement() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { loadMerchants(); }, []);

  const loadMerchants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await merchantService.getAll();
      setMerchants(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load merchants');
    }
    setLoading(false);
  };

  const handleVerify = async (merchant) => {
    setActionLoading(merchant.id);
    try {
      await apiClient.put(`/admin/merchants/${merchant.id}/verify`);
      toast.success(`${merchant.business_name} verified!`);
      loadMerchants();
    } catch { toast.error('Verification failed'); }
    setActionLoading(null);
  };

  const handleReject = async (merchant) => {
    setActionLoading(merchant.id);
    try {
      await apiClient.put(`/admin/merchants/${merchant.id}/reject`);
      toast.success(`${merchant.business_name} rejected`);
      loadMerchants();
    } catch { toast.error('Rejection failed'); }
    setActionLoading(null);
  };

  const handleSuspend = async (merchant) => {
    setActionLoading(merchant.id);
    try {
      await apiClient.put(`/admin/merchants/${merchant.id}/suspend`);
      toast.success(`${merchant.business_name} suspended`);
      loadMerchants();
    } catch { toast.error('Suspension failed'); }
    setActionLoading(null);
  };

  const handleResubmit = async (merchant) => {
    setActionLoading(merchant.id);
    try {
      await apiClient.put(`/admin/merchants/${merchant.id}/resubmit`);
      toast.success(`${merchant.business_name} moved to pending`);
      loadMerchants();
    } catch { toast.error('Action failed (endpoint pending)'); }
    setActionLoading(null);
  };

  const filtered = merchants.filter((m) => m.status === activeTab);

  if (loading) return <LoadingSpinner text="Loading merchants..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadMerchants} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Merchant Management</h1>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
              {merchants.filter((m) => m.status === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
          No {activeTab} merchants found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-lg border p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{m.business_name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{m.user?.email || m.email || `User #${m.user_id}`}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                {m.phone && <p>Phone: {m.phone}</p>}
                {m.avg_rating > 0 && <p>Rating: {Number(m.avg_rating).toFixed(1)} / 5</p>}
                {m.verified_at && <p>Verified: {new Date(m.verified_at).toLocaleDateString()}</p>}
              </div>
              <div className="mt-4 flex gap-2">
                {activeTab === 'pending' && (
                  <>
                    <button
                      onClick={() => handleVerify(m)}
                      disabled={actionLoading === m.id}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" /> Verify
                    </button>
                    <button
                      onClick={() => handleReject(m)}
                      disabled={actionLoading === m.id}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                  </>
                )}
                {activeTab === 'active' && (
                  <button
                    onClick={() => handleSuspend(m)}
                    disabled={actionLoading === m.id}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    <Shield className="h-4 w-4" /> Suspend
                  </button>
                )}
                {activeTab === 'suspended' && (
                  <button
                    onClick={() => handleResubmit(m)}
                    disabled={actionLoading === m.id}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    <UserCheck className="h-4 w-4" /> Resubmit for Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
