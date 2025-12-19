// components/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Map, 
  Star, 
  Building2, 
  Settings, 
  LogOut, 
  X,
  Circle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      setUserEmail(user.email);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  function navigate(path: string) {
    router.push(path);
    onClose();
  }

  return (
    <>
      {/* Dark Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-cyan-600">DeKUT Navigator</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Campus navigation for Dedan Kimathi University of Technology
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 py-4">
            <MenuItem
              icon={<Map className="w-5 h-5" />}
              label="Map"
              onClick={() => navigate('/')}
              active
            />
            <MenuItem
              icon={<Star className="w-5 h-5" />}
              label="Favorites"
              onClick={() => navigate('/favorites')}
            />
            <MenuItem
              icon={<Building2 className="w-5 h-5" />}
              label="All Buildings"
              onClick={() => navigate('/buildings')}
            />
            <MenuItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              onClick={() => navigate('/settings')}
            />
          </nav>

          {/* Map Legend */}
          <div className="px-4 pb-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Map Legend</h3>
            <div className="space-y-2">
              <LegendItem color="#0891B2" label="Academic" />
              <LegendItem color="#0891B2" label="Administrative" />
              <LegendItem color="#0891B2" label="Services" />
              <LegendItem color="#14B8A6" label="Recreation" />
              <LegendItem color="#8B5CF6" label="Residential" />
              <LegendItem color="#EF4444" label="Entry Point" />
            </div>
          </div>

          {/* User Info & Sign Out */}
          <div className="p-4 border-t">
            <div className="mb-3">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {userEmail || 'kirimi.koome22'}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Menu Item Component
function MenuItem({
  icon,
  label,
  onClick,
  active = false
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
        active
          ? 'bg-cyan-50 text-cyan-600 border-r-4 border-cyan-600'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Legend Item Component
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Circle className="w-4 h-4" style={{ fill: color, color }} />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}