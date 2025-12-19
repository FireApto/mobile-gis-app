// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/Sidebar';
import dynamic from 'next/dynamic';
import { 
  Menu, 
  Search, 
  Locate, 
  Plus, 
  Minus,
  Loader2
} from 'lucide-react';

const Map = dynamic(() => import('@/components/Map').then(mod => ({ default: mod.Map })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
    </div>
  )
});

interface Building {
  id: number;
  name: string | null;
  center_lat: number;
  center_lng: number;
  category?: {
    name: string;
    color: string;
  };
}

export default function MapPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Building[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-0.3924, 36.9626]);
  const [mapZoom, setMapZoom] = useState(17);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null); // ADD THIS
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuildings();
    getUserLocation();
  }, []);

  async function loadBuildings() {
    try {
      const { data } = await supabase
        .from('buildings')
        .select(`
          id,
          name,
          center_lat,
          center_lng,
          category:building_categories(name, color)
        `);

      if (data) {
        setBuildings(data);
      }
    } catch (error) {
      console.error('Error loading buildings:', error);
    } finally {
      setLoading(false);
    }
  }

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Location access denied, using default center');
        }
      );
    }
  }

  async function handleSearch(query: string) {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const { data } = await supabase
      .from('buildings')
      .select(`
        id,
        name,
        center_lat,
        center_lng,
        category:building_categories(name, color)
      `)
      .ilike('name', `%${query}%`)
      .limit(5);

    if (data) {
      setSearchResults(data);
      setShowSearchResults(true);
    }
  }

  function selectBuilding(building: Building) {
    setShowSearchResults(false);
    setSearchQuery(building.name || ''); // KEEP THE NAME IN SEARCH
    setMapCenter([building.center_lat, building.center_lng]);
    setMapZoom(19); // ZOOM IN CLOSER
    setSelectedBuildingId(building.id); // SELECT THE BUILDING
  }

  function handleBuildingClick(buildingId: number) {
    setSelectedBuildingId(buildingId);
    const building = buildings.find(b => b.id === buildingId);
    if (building) {
      setMapCenter([building.center_lat, building.center_lng]);
      setMapZoom(19);
    }
  }

  function handleLocateMe() {
    getUserLocation();
    setMapZoom(19);
    setSelectedBuildingId(null); // CLEAR SELECTION
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative h-full">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <div className="bg-white shadow-lg m-4 rounded-lg">
            <div className="flex items-center gap-2 p-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search buildings, facilities, or types..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-80 overflow-y-auto">
                    {searchResults.map((building) => (
                      <button
                        key={building.id}
                        onClick={() => selectBuilding(building)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">
                          {building.name}
                        </div>
                        {building.category && (
                          <div className="text-sm text-gray-500 mt-0.5">
                            {building.category.name}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="absolute inset-0">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Loader2 className="w-12 h-12 animate-spin text-cyan-600" />
            </div>
          ) : (
            <Map
              buildings={buildings}
              center={mapCenter}
              zoom={mapZoom}
              selectedBuildingId={selectedBuildingId} // PASS SELECTED ID
              onBuildingClick={handleBuildingClick}
            />
          )}
        </div>

        {/* Map Controls */}
        <div className="absolute right-4 top-24 z-20 flex flex-col gap-2">
          <button 
            onClick={handleLocateMe}
            className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Locate className="w-6 h-6 text-gray-700" />
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button 
              onClick={() => setMapZoom(prev => Math.min(prev + 1, 19))}
              className="p-3 hover:bg-gray-50 transition-colors border-b"
            >
              <Plus className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              onClick={() => setMapZoom(prev => Math.max(prev - 1, 10))}
              className="p-3 hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="absolute bottom-6 left-0 right-0 z-20 px-4">
          <div className="bg-white rounded-full shadow-xl p-2 flex items-center justify-center gap-2 max-w-md mx-auto">
            <button
              onClick={() => router.push('/buildings')}
              className="flex-1 px-4 py-2 rounded-full font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
            >
              All Buildings
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <button
              onClick={() => router.push('/favorites')}
              className="flex-1 px-4 py-2 rounded-full font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
            >
              Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}