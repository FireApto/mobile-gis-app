// components/Map.tsx
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

interface MapProps {
  buildings: Building[];
  center?: [number, number];
  zoom?: number;
  selectedBuildingId?: number | null; // ADD THIS
  onBuildingClick?: (buildingId: number) => void;
}

// Custom marker icon creator
function createCustomIcon(color: string = '#0891B2', isSelected: boolean = false) {
  const size = isSelected ? 40 : 32;
  const pulseAnimation = isSelected ? 'animation: pulse 2s infinite;' : '';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: ${isSelected ? '4px' : '3px'} solid white;
        box-shadow: 0 ${isSelected ? '4px 12px' : '2px 8px'} rgba(0,0,0,${isSelected ? '0.4' : '0.3'});
        ${pulseAnimation}
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: ${isSelected ? '20px' : '16px'};
          margin-top: ${isSelected ? '6px' : '4px'};
          text-align: center;
        ">${isSelected ? '📍' : '📍'}</div>
      </div>
      ${isSelected ? `
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1) rotate(-45deg); }
            50% { transform: scale(1.1) rotate(-45deg); }
          }
        </style>
      ` : ''}
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// Component to handle map centering and popup opening
function MapUpdater({ 
  center, 
  selectedBuildingId, 
  buildings 
}: { 
  center: [number, number];
  selectedBuildingId?: number | null;
  buildings: Building[];
}) {
  const map = useMap();
  
  useEffect(() => {
    if (map && center && center[0] != null && center[1] != null) {
      try {
        map.setView(center, map.getZoom());
        
        // If a building is selected, find and open its popup
        if (selectedBuildingId) {
          setTimeout(() => {
            map.eachLayer((layer: any) => {
              if (layer instanceof L.Marker) {
                const building = buildings.find(b => b.id === selectedBuildingId);
                if (building && 
                    layer.getLatLng().lat === building.center_lat && 
                    layer.getLatLng().lng === building.center_lng) {
                  layer.openPopup();
                }
              }
            });
          }, 100);
        }
      } catch (error) {
        console.error('Error updating map view:', error);
      }
    }
  }, [center, map, selectedBuildingId, buildings]);
  
  return null;
}

export function Map({ 
  buildings, 
  center = [-0.3924, 36.9626], 
  zoom = 17,
  selectedBuildingId = null, // ADD THIS
  onBuildingClick 
}: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater 
        center={center} 
        selectedBuildingId={selectedBuildingId}
        buildings={buildings}
      />

      {/* Building Markers */}
      {buildings
        .filter(building => 
          building.center_lat != null && 
          building.center_lng != null &&
          !isNaN(building.center_lat) &&
          !isNaN(building.center_lng)
        )
        .map((building) => {
          const color = building.category?.color || '#0891B2';
          const isSelected = building.id === selectedBuildingId; // CHECK IF SELECTED
          
          return (
            <Marker
              key={building.id}
              position={[building.center_lat, building.center_lng]}
              icon={createCustomIcon(color, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onBuildingClick) {
                    onBuildingClick(building.id);
                  }
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {building.name || 'Unnamed Building'}
                  </h3>
                  {building.category && (
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-medium rounded"
                      style={{
                        backgroundColor: `${color}20`,
                        color: color
                      }}
                    >
                      {building.category.name}
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}