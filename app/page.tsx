'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Menu, X, Star, Building2, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { Building } from '@/lib/types';

// Import Map dynamically to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="text-center text-white">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
          <MapPin className="w-12 h-12" />
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

// Navigation Drawer Component
function NavigationDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  
  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-600">DeKUT Navigator</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 text-sm">Campus navigation for DeKUT</p>
        </div>

        <div className="py-2">
          <button 
            onClick={() => handleNavigation('/')}
            className="w-full px-6 py-4 flex items-center hover:bg-blue-50"
          >
            <MapPin className="w-5 h-5 text-blue-600 mr-4" />
            <span className="font-medium">Map</span>
          </button>
          <button 
            onClick={() => handleNavigation('/favorites')}
            className="w-full px-6 py-4 flex items-center hover:bg-blue-50"
          >
            <Star className="w-5 h-5 text-gray-700 mr-4" />
            <span className="font-medium">Favorites</span>
          </button>
          <button 
            onClick={() => handleNavigation('/buildings')}
            className="w-full px-6 py-4 flex items-center hover:bg-blue-50"
          >
            <Building2 className="w-5 h-5 text-gray-700 mr-4" />
            <span className="font-medium">All Buildings</span>
          </button>
          <button 
            onClick={() => handleNavigation('/settings')}
            className="w-full px-6 py-4 flex items-center hover:bg-blue-50"
          >
            <Settings className="w-5 h-5 text-gray-700 mr-4" />
            <span className="font-medium">Settings</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t">
          <div className="px-6 py-4 border-b">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-medium">kirimi.koome22</p>
          </div>
          <button className="w-full px-6 py-4 flex items-center hover:bg-red-50">
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Welcome Screen - Auto disappears after 3 seconds
function WelcomeScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center z-50">
      <div className="text-center text-white px-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
          <MapPin className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold mb-2">DeKUT Navigator</h1>
        <p className="text-blue-100 text-lg">Campus navigation for Dedan Kimathi University</p>
        <div className="mt-6">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
}

// Main App
export default function DeKUTNavigator() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // Auto-hide welcome screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return <WelcomeScreen />;
  }

return (
  <div className="relative w-full h-screen overflow-hidden">
    <NavigationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    
    {/* Hamburger Menu Button */}
    <button
      onClick={() => setDrawerOpen(true)}
      className="fixed top-4 left-4 z-[1001] w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
    >
      <Menu className="w-6 h-6" />
    </button>

    {/* Map Container - Full Screen */}
    <div className="absolute inset-0 w-full h-full">
      <Map 
        selectedBuilding={selectedBuilding}
        onBuildingClick={setSelectedBuilding}
        categoryFilter={['academic', 'administrative', 'services', 'recreation']}
      />
    </div>
  </div>
);
}