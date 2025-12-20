// app/directions/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Building } from '@/types/database.types';
import { 
  ChevronLeft, 
  Navigation, 
  Clock, 
  MapPin,
  Loader2,
  Target,
  X
} from 'lucide-react';

function DirectionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destinationId = searchParams.get('to');

  const [origin, setOrigin] = useState<Building | null>(null);
  const [destination, setDestination] = useState<Building | null>(null);
  const [allBuildings, setAllBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOriginSelect, setShowOriginSelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBuildings();
  }, []);

  useEffect(() => {
    // Set destination when buildings are loaded
    if (destinationId && allBuildings.length > 0) {
      const dest = allBuildings.find(b => b.id === parseInt(destinationId));
      if (dest) {
        setDestination(dest);
      }
    }
  }, [destinationId, allBuildings]);

  async function loadBuildings() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('buildings')
        .select(`
          id,
          name,
          center_lat,
          center_lng,
          category:building_categories(name, color)
        `)
        .order('name');

      if (data) {
        // Transform data to match Building type
        const buildings: Building[] = data.map((item: any) => ({
          ...item,
          category: Array.isArray(item.category) ? item.category[0] : item.category
        }));
        setAllBuildings(buildings);
      }
    } catch (error) {
      console.error('Error loading buildings:', error);
    } finally {
      setLoading(false);
    }
  }

  function selectOrigin(building: Building) {
    setOrigin(building);
    setShowOriginSelect(false);
    setSearchQuery('');
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrigin({
            id: 0,
            name: 'My Location',
            center_lat: position.coords.latitude,
            center_lng: position.coords.longitude
          } as Building);
          setShowOriginSelect(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  function calculateDistance() {
    if (!origin || !destination) return null;
    
    const R = 6371e3; // Earth radius in meters
    const φ1 = origin.center_lat * Math.PI / 180;
    const φ2 = destination.center_lat * Math.PI / 180;
    const Δφ = (destination.center_lat - origin.center_lat) * Math.PI / 180;
    const Δλ = (destination.center_lng - origin.center_lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return Math.round(R * c); // Distance in meters
  }

  const distance = calculateDistance();
  const walkingTime = distance ? Math.ceil(distance / 83) : null;
  
  const filteredBuildings = allBuildings.filter(b => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-cyan-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-cyan-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Directions</h1>
              {distance && walkingTime && (
                <p className="text-cyan-100 text-sm">
                  {distance}m · {walkingTime} min walk
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Route Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          {/* Origin */}
          <div className="flex items-start gap-3 mb-4">
            <div className="mt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            {origin ? (
              <div className="flex-1">
                <p className="font-medium text-gray-900">{origin.name}</p>
                <p className="text-sm text-gray-500">Starting point</p>
              </div>
            ) : (
              <button
                onClick={() => setShowOriginSelect(true)}
                className="flex-1 text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="text-gray-600">Choose starting point</p>
              </button>
            )}
            {origin && (
              <button
                onClick={() => setOrigin(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Connector Line */}
          <div className="flex items-center gap-3 my-2">
            <div className="ml-1 w-px h-8 bg-gray-300" />
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {destination?.name || 'No destination'}
              </p>
              {destination?.category && (
                <span
                  className="inline-block px-2 py-0.5 text-xs font-medium rounded mt-1"
                  style={{
                    backgroundColor: `${destination.category.color}20`,
                    color: destination.category.color
                  }}
                >
                  {destination.category.name}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {!origin && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={getCurrentLocation}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Target className="w-5 h-5" />
                <span>Use My Location</span>
              </button>
            </div>
          )}
        </div>

        {/* Step-by-Step Directions */}
        {origin && destination && distance && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Step-by-Step Directions
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-50 rounded-full text-cyan-600">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Head towards {destination.name}</p>
                  <p className="text-sm text-gray-500">{distance}m</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-50 rounded-full text-cyan-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Continue walking for about {walkingTime} minutes</p>
                  <p className="text-sm text-gray-500">{walkingTime} min</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-50 rounded-full text-cyan-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Arrive at {destination.name}</p>
                  <p className="text-sm text-gray-500">Destination</p>
                </div>
              </div>
            </div>

            {/* Open in External Map */}
            <button
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.center_lat},${origin.center_lng}&destination=${destination.center_lat},${destination.center_lng}&travelmode=walking`;
                window.open(url, '_blank');
              }}
              className="w-full mt-4 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Open in Google Maps
            </button>
          </div>
        )}

        {/* Start Navigation Button */}
        {origin && destination && (
          <button
            onClick={() => router.push(`/?from=${origin.id}&to=${destination.id}`)}
            className="w-full px-6 py-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-bold text-lg shadow-lg flex items-center justify-center gap-2"
          >
            <Navigation className="w-6 h-6" />
            <span>Start Navigation</span>
          </button>
        )}
      </div>

      {/* Origin Selection Modal */}
      {showOriginSelect && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowOriginSelect(false);
          }}
        >
          <div className="bg-white w-full sm:max-w-lg sm:rounded-lg max-h-[80vh] flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Choose Starting Point</h3>
                <button
                  onClick={() => setShowOriginSelect(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Search buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <button
                onClick={getCurrentLocation}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b flex items-center gap-3 transition-colors"
              >
                <div className="p-2 bg-cyan-50 rounded-full">
                  <Target className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">My Location</p>
                  <p className="text-sm text-gray-500">Use current location</p>
                </div>
              </button>
              {filteredBuildings.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No buildings found</p>
                </div>
              ) : (
                filteredBuildings.map((building) => (
                  <button
                    key={building.id}
                    onClick={() => selectOrigin(building)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b transition-colors"
                  >
                    <p className="font-medium text-gray-900">{building.name}</p>
                    {building.category && (
                      <p className="text-sm text-gray-500">{building.category.name}</p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DirectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
      </div>
    }>
      <DirectionsContent />
    </Suspense>
  );
}