import { Star, MapPin, Briefcase } from 'lucide-react';

export default function MerchantCard({ merchant, onSelect, showSelect = true, selectLabel = 'Select' }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
            {merchant.business_name?.[0] || 'M'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{merchant.business_name || 'Unnamed Merchant'}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span>{merchant.avg_rating ? Number(merchant.avg_rating).toFixed(1) : 'N/A'}</span>
              <span className="mx-1">·</span>
              <span>{merchant.review_count || 0} reviews</span>
            </div>
          </div>
        </div>
        {merchant.score !== undefined && (
          <div className="text-center">
            <div className="text-sm font-semibold text-indigo-600">Score</div>
            <div className="text-2xl font-bold text-indigo-700">{Number(merchant.score).toFixed(0)}</div>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        {merchant.location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="h-3.5 w-3.5" />
            {merchant.location}
          </div>
        )}
        {merchant.distance !== undefined && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="h-3.5 w-3.5" />
            {Number(merchant.distance).toFixed(1)} km away
          </div>
        )}
        {merchant.hourly_rate && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Briefcase className="h-3.5 w-3.5" />
            NPR {Number(merchant.hourly_rate).toLocaleString()}/hr
          </div>
        )}
      </div>

      {showSelect && onSelect && (
        <button
          onClick={() => onSelect(merchant)}
          className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          {selectLabel}
        </button>
      )}
    </div>
  );
}
