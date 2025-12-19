// app/navigate/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Navigation, MapPin, Clock, Flag } from 'lucide-react';

interface Building {
  id: number;
  name: string;
  building_type: string;
  center_lat: number;
  center_lng: number;
}

export default function NavigatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [route, setRoute] = useState<any>(null);

  useEffect(() => {
    loadBuildings();
    
    // Check if destination is pre-selected from URL
    const toId = searchParams.get('to');
    if (toId) {
      setDestination(toId);
    }
  }, [searchParams]);

  async function loadBuildings() {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('id, name, building_type, center_lat, center_lng')
        .order('name');

      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      console.error('Error loading buildings:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateRoute() {
    if (!origin || !destination) {
      alert('Please select both origin and destination');
      return;
    }

    if (origin === destination) {
      alert('Origin and destination cannot be the same');
      return;
    }

    setCalculating(true);

    // Simulate route calculation (you'll add real routing later)
    setTimeout(() => {
      const originBuilding = buildings.find(b => b.id.toString() === origin);
      const destBuilding = buildings.find(b => b.id.toString() === destination);

      if (originBuilding && destBuilding) {
        // Calculate simple straight-line distance (you'll use proper routing later)
        const distance = calculateDistance(
          originBuilding.center_lat,
          originBuilding.center_lng,
          destBuilding.center_lat,
          destBuilding.center_lng
        );

        const walkingSpeed = 1.4; // meters per second (average walking speed)
        const timeInSeconds = distance / walkingSpeed;
        const timeInMinutes = Math.ceil(timeInSeconds / 60);

        setRoute({
          origin: originBuilding,
          destination: destBuilding,
          distance: Math.round(distance),
          duration: timeInMinutes,
          steps: [
            { instruction: `Exit ${originBuilding.name} and head towards the main path`, distance: 50 },
            { instruction: 'Follow the main path towards the campus center', distance: distance * 0.4 },
            { instruction: 'Turn at the intersection near the library', distance: distance * 0.3 },
            { instruction: `Continue straight until you reach ${destBuilding.name}`, distance: distance * 0.3 },
          ]
        });
      }

      setCalculating(false);
    }, 1500);
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function startNavigation() {
    // This will open the map view with navigation active
    router.push(`/?navigate=true&from=${origin}&to=${destination}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-blue-700 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Navigation</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Origin Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            Starting Point
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select origin...</option>
            {buildings.map(building => (
              <option key={building.id} value={building.id}>
                {building.name || 'Unnamed Building'}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-600" />
            </div>
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select destination...</option>
            {buildings.map(building => (
              <option key={building.id} value={building.id}>
                {building.name || 'Unnamed Building'}
              </option>
            ))}
          </select>
        </div>

        {/* Calculate Route Button */}
        <button
          onClick={calculateRoute}
          disabled={calculating}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {calculating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Calculating...
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              Calculate Route
            </>
          )}
        </button>

        {/* Route Result */}
        {route && (
          <div className="space-y-4 animate-fadeIn">
            {/* Route Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">{route.duration} min</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="text-lg font-semibold text-gray-900">{route.distance}m</p>
                </div>
              </div>
              
              <button
                onClick={startNavigation}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Start Navigation
              </button>
            </div>

            {/* Turn-by-turn Directions */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-900">Directions</h3>
              </div>
              <div className="divide-y">
                {route.steps.map((step: any, index: number) => (
                  <div key={index} className="p-4 flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1">{step.instruction}</p>
                      <p className="text-sm text-gray-500">{step.distance}m</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}