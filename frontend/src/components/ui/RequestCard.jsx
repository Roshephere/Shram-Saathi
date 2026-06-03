import StatusBadge from './StatusBadge';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

export default function RequestCard({ request, onClick }) {
  return (
    <div
      onClick={() => onClick?.(request)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md cursor-pointer transition-shadow"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900">{request.title || 'Untitled Request'}</h3>
        <StatusBadge status={request.status} />
      </div>
      {request.description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{request.description}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
        {request.category && <span className="text-indigo-600">{request.category.name || request.category}</span>}
        {request.budget_min && (
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            NPR {Number(request.budget_min).toLocaleString()}{request.budget_max ? ` - ${Number(request.budget_max).toLocaleString()}` : ''}
          </span>
        )}
        {request.location_text && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {request.location_text}
          </span>
        )}
        {request.created_at && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(request.created_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
