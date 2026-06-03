const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  open: 'bg-blue-100 text-blue-800',
  bidding: 'bg-purple-100 text-purple-800',
  assigned: 'bg-indigo-100 text-indigo-800',
  accepted: 'bg-teal-100 text-teal-800',
  in_progress: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-100 text-red-800',
  verified: 'bg-emerald-100 text-emerald-800',
};

export default function StatusBadge({ status, className = '' }) {
  const color = statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      {status}
    </span>
  );
}
