// app/settings/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Volume2, Smartphone, Navigation, Moon, Bell, MapPin, Info } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  
  // Settings state
  const [settings, setSettings] = useState({
    voiceNavigation: true,
    vibrationAlerts: true,
    autoRerouting: true,
    darkMode: false,
    notifications: true,
    locationTracking: true,
  });

  function toggleSetting(key: string) {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-4 space-y-6">
        {/* Navigation Options Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="font-semibold text-gray-700">Navigation Options</h2>
          </div>

          {/* Voice Navigation */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Voice Navigation</h3>
                <p className="text-sm text-gray-500">Turn-by-turn voice guidance</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('voiceNavigation')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.voiceNavigation ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.voiceNavigation ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Vibration Alerts */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Vibration Alerts</h3>
                <p className="text-sm text-gray-500">Vibrate for navigation alerts</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('vibrationAlerts')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.vibrationAlerts ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.vibrationAlerts ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Auto Rerouting */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Auto Rerouting</h3>
                <p className="text-sm text-gray-500">Automatically find new routes when off course</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('autoRerouting')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.autoRerouting ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.autoRerouting ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* App Customization Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="font-semibold text-gray-700">App Customization</h2>
          </div>

          {/* Dark Mode */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Dark Mode</h3>
                <p className="text-sm text-gray-500">Switch between light and dark theme</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('darkMode')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">Receive app notifications</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('notifications')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Location Tracking */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Location Tracking</h3>
                <p className="text-sm text-gray-500">Allow app to track your location</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('locationTracking')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.locationTracking ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.locationTracking ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => alert('DeKUT Navigator v1.0\n\nCampus navigation for Dedan Kimathi University of Technology')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">About DeKUT Navigator</h3>
                <p className="text-sm text-gray-500">Version 1.0</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}