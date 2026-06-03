import { useState, useEffect } from 'react';
import { userService } from '../../api/userService';
import apiClient from '../../api/client';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';
import { Shield, Eye, Trash2 } from 'lucide-react';

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  worker: 'bg-green-100 text-green-800',
  customer: 'bg-blue-100 text-blue-800',
};

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleModal, setRoleModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newRole, setNewRole] = useState('customer');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load users.');
    }
    setLoading(false);
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.roles?.[0]?.name || user.role || 'customer');
    setRoleModal(true);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await apiClient.post(`/users/${selectedUser.id}/roles`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setRoleModal(false);
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Role update failed';
      toast.error(msg);
      setRoleModal(false);
    }
    setSaving(false);
  };

  const openViewModal = async (user) => {
    setViewUser(null);
    setViewModal(true);
    setViewLoading(true);
    try {
      const data = await userService.getUserById(user.id);
      setViewUser(data);
    } catch {
      setViewUser(user);
    }
    setViewLoading(false);
  };

  const handleDelete = async (user) => {
    setDeleteConfirm(user);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await userService.deleteUser(deleteConfirm.id);
      toast.success(`User ${deleteConfirm.name} deleted`);
      setDeleteConfirm(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
      setDeleteConfirm(null);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'role', label: 'Role',
      render: (row) => {
        const roleName = row.roles?.[0]?.name || row.role || 'customer';
        return <StatusBadge status={roleName} className={roleColors[roleName] || ''} />;
      },
    },
    {
      key: 'status', label: 'Status',
      render: (row) => <StatusBadge status={row.status !== false && row.status !== 0 ? 'active' : 'inactive'} />,
    },
    {
      key: 'created_at', label: 'Joined',
      render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-',
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); openViewModal(row); }}
            className="flex items-center gap-1 text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium">
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          <button onClick={(e) => { e.stopPropagation(); openRoleModal(row); }}
            className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium">
            <Shield className="h-3.5 w-3.5" />
            Role
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
            className="flex items-center gap-1 text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner text="Loading users..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadUsers} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <span className="text-sm text-gray-500">{users.length} users</span>
      </div>

      <DataTable columns={columns} data={users} loading={loading} />

      {/* View Modal */}
      <Modal open={viewModal} onClose={() => setViewModal(false)} title="User Details" size="md">
        {viewLoading ? (
          <LoadingSpinner text="Loading user..." />
        ) : viewUser ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">ID</p>
                <p className="text-sm font-medium text-gray-900">#{viewUser.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900">{viewUser.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{viewUser.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">{viewUser.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <StatusBadge status={viewUser.roles?.[0]?.name || viewUser.role || 'customer'}
                  className={roleColors[viewUser.roles?.[0]?.name || viewUser.role || 'customer'] || ''} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <StatusBadge status={viewUser.status !== false && viewUser.status !== 0 ? 'active' : 'inactive'} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm font-medium text-gray-900">
                  {viewUser.created_at ? new Date(viewUser.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email Verified</p>
                <p className="text-sm font-medium text-gray-900">
                  {viewUser.email_verified_at ? new Date(viewUser.email_verified_at).toLocaleDateString() : 'No'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Could not load user details.</p>
        )}
      </Modal>

      {/* Role Modal */}
      <Modal open={roleModal} onClose={() => setRoleModal(false)} title={`Manage Role: ${selectedUser?.name || ''}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
            <p className="text-sm text-gray-900 font-medium">
              {selectedUser?.roles?.[0]?.name || selectedUser?.role || 'customer'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Role</label>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="customer">Customer</option>
              <option value="worker">Worker / Merchant</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setRoleModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={handleRoleChange} disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Updating...' : 'Update Role'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteConfirm?.name || 'this user'}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
