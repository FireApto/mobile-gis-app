// app/page.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import BuildingDetails from '@/components/BuildingDetails';
import type { Building, BuildingCategory } from '@/lib/types';

// Import Map component dynamically to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="text-center text-white">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2">DeKUT Navigator</h2>
        <p className="text-blue-100 text-lg mb-6">Your Campus Guide</p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="mt-4 text-sm text-blue-200">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<BuildingCategory[]>([
    'academic', 'administrative', 'services', 'recreation'
  ]);

  const handleCategoryChange = (categories: BuildingCategory[]) => {
    setCategoryFilter(categories);
  };

  const handleShowAllBuildings = () => {
    // TODO: Implement show all buildings functionality
    console.log('Show all buildings');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        onCategoryChange={handleCategoryChange}
        buildingCount={185}
        onShowAllBuildings={handleShowAllBuildings}
      />

      {/* Map Container */}
      <div className="flex-1 relative">
        <Map
          selectedBuilding={selectedBuilding}
          onBuildingClick={setSelectedBuilding}
          categoryFilter={categoryFilter}
        />

        {/* Building Details Panel */}
        <BuildingDetails
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
        />
      </div>
    </div>
  );
}