import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Search, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Default center: Kathmandu, Nepal
const NEPAL_CENTER = { lat: 27.7172, lng: 85.3240 };

// Fix default marker icon issue with webpack/vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon (blue pin)
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ─── Inner component that handles map click events ────────────────────────
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// ─── Inner component that flies to a position ──────────────────────────────
function FlyToPosition({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

// ─── Inner component for address search ────────────────────────────────────
function SearchControl({ onResult, placeholder }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef(null);

  const searchAddress = useCallback(async (q) => {
    if (q.length < 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=np&limit=5`
      );
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddress(val), 400);
  };

  const selectResult = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    onResult({ lat, lng, address: item.display_name });
    setQuery(item.display_name.length > 50 ? item.display_name.substring(0, 50) + '...' : item.display_name);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder || 'Search address in Nepal...'}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setShowResults(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-[1000] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {results.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectResult(item)}
              className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 border-b last:border-b-0 text-sm text-gray-700 transition-colors"
            >
              <MapPin className="h-3 w-3 inline mr-1.5 text-indigo-500 flex-shrink-0" />
              {item.display_name}
            </button>
          ))}
        </div>
      )}

      {searching && (
        <div className="absolute z-[1000] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
          Searching...
        </div>
      )}
    </div>
  );
}

// ─── Main LocationPicker Component ────────────────────────────────────────
export default function LocationPicker({
  value = null,           // { lat, lng }
  onChange = () => {},    // ({ latitude, longitude, address }) => void
  height = '320px',
  showSearch = true,
  placeholder,
  label,
  required = false,
  error = null,
  disabled = false,
}) {
  const [position, setPosition] = useState(
    value ? { lat: Number(value.lat), lng: Number(value.lng) } : null
  );
  const [address, setAddress] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  // Reverse geocode coordinates to get address
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      return data.display_name || '';
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }, []);

  // Handle map click or marker drag
  const handleMapClick = useCallback(async ({ lat, lng }) => {
    if (disabled) return;
    const newPos = { lat, lng };
    setPosition(newPos);
    const addr = await reverseGeocode(lat, lng);
    setAddress(addr);
    onChange({ latitude: lat, longitude: lng, address: addr });
  }, [disabled, reverseGeocode, onChange]);

  // Handle search result selection
  const handleSearchResult = useCallback(async ({ lat, lng, address: searchAddr }) => {
    const newPos = { lat, lng };
    setPosition(newPos);
    setAddress(searchAddr);
    onChange({ latitude: lat, longitude: lng, address: searchAddr });
  }, [onChange]);

  // Browser geolocation
  const detectMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(newPos);
        const addr = await reverseGeocode(newPos.lat, newPos.lng);
        setAddress(addr);
        onChange({ latitude: newPos.lat, longitude: newPos.lng, address: addr });
        setGettingLocation(false);
        toast.success('Location detected!');
      },
      () => {
        setGettingLocation(false);
        toast.error('Could not get location. Try searching or clicking the map.');
      }
    );
  };

  // Clear the selection
  const clearPosition = () => {
    setPosition(null);
    setAddress('');
    onChange({ latitude: null, longitude: null, address: '' });
  };

  const initialCenter = position || NEPAL_CENTER;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={detectMyLocation}
          disabled={gettingLocation || disabled}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-indigo-300 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
        >
          <Navigation className={`h-4 w-4 ${gettingLocation ? 'animate-spin' : ''}`} />
          {gettingLocation ? 'Detecting...' : 'Use My Location'}
        </button>

        {position && !disabled && (
          <button
            type="button"
            onClick={clearPosition}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {showSearch && (
        <SearchControl
          onResult={handleSearchResult}
          placeholder={placeholder}
        />
      )}

      {/* Map container */}
      <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
        <MapContainer
          center={[initialCenter.lat, initialCenter.lng]}
          zoom={position ? 15 : 12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={!disabled}
          dragging={!disabled}
          doubleClickZoom={!disabled}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {position && <FlyToPosition position={position} />}
          {position && (
            <Marker
              position={[position.lat, position.lng]}
              icon={customIcon}
              draggable={!disabled}
              eventHandlers={{
                dragend: (e) => {
                  const pos = e.target.getLatLng();
                  handleMapClick({ lat: pos.lat, lng: pos.lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Coordinates display */}
      {position && (
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </span>
          {address && (
            <span className="truncate max-w-xs" title={address}>
              {address.length > 40 ? address.substring(0, 40) + '...' : address}
            </span>
          )}
        </div>
      )}

      {/* Hidden inputs for form submission */}
      <input type="hidden" name="latitude" value={position?.lat || ''} />
      <input type="hidden" name="longitude" value={position?.lng || ''} />
      <input type="hidden" name="address" value={address} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!position && !disabled && (
        <p className="text-xs text-gray-400">
          Click on the map or search above to select a location
        </p>
      )}
    </div>
  );
}
