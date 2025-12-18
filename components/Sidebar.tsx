// components/Sidebar.tsx
'use client';

import { useState } from 'react';
import type { BuildingCategory } from '@/lib/types';

interface SidebarProps {
  onCategoryChange: (categories: BuildingCategory[]) => void;
  buildingCount: number;
  onShowAllBuildings: () => void;
}

export default function Sidebar({ onCategoryChange, buildingCount, onShowAllBuildings }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'favorites' | 'buildings' | 'settings'>('map');
  const [selectedCategories, setSelectedCategories] = useState<BuildingCategory[]>([
    'academic', 'administrative', 'services', 'recreation'
  ]);

  const categories = [
    { id: 'academic' as BuildingCategory, name: 'Academic', color: 'bg-blue-500', icon: '📚' },
    { id: 'administrative' as BuildingCategory, name: 'Administrative', color: 'bg-purple-500', icon: '🏛️' },
    { id: 'services' as BuildingCategory, name: 'Services', color: 'bg-red-500', icon: '🔧' },
    { id: 'recreation' as BuildingCategory, name: 'Recreation', color: 'bg-orange-500', icon: '⚽' },
  ];

  const toggleCategory = (categoryId: BuildingCategory) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updated);
    onCategoryChange(updated);
  };

  return (
    <div className="w-72 h-full bg-white shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">DeKUT Navigator</h1>
            <p className="text-sm text-blue-100">Your Campus Guide</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('map')}
          className={`w-full px-6 py-3 flex items-center gap-3 transition-colors ${
            activeTab === 'map' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="font-medium">Map</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`w-full px-6 py-3 flex items-center gap-3 transition-colors ${
            activeTab === 'favorites' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span className="font-medium">Favorites</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('buildings');
            onShowAllBuildings();
          }}
          className={`w-full px-6 py-3 flex items-center gap-3 transition-colors ${
            activeTab === 'buildings' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="font-medium">All Buildings</span>
          <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
            {buildingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full px-6 py-3 flex items-center gap-3 transition-colors ${
            activeTab === 'settings' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Settings</span>
        </button>
      </nav>

      {/* Map Legend */}
      {activeTab === 'map' && (
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Map Legend</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  selectedCategories.includes(category.id)
                    ? 'border-gray-300 bg-white shadow-sm'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                  <span className="text-lg">{category.icon}</span>
                </div>
                <span className="font-medium text-gray-900">{category.name}</span>
                <div className="ml-auto">
                  {selectedCategories.includes(category.id) ? (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            K
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">kirimi.koome22</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}