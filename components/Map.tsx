// components/Map.tsx
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Building, Road, POI, BuildingCategory } from '@/lib/types';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEKUT_CENTER: [number, number] = [-0.393825, 36.960631];
const DEFAULT_ZOOM = 16;

interface MapProps {
  selectedBuilding?: Building | null;
  onBuildingClick?: (building: Building) => void;
  categoryFilter: BuildingCategory[];
}

function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1 });
    }
  }, [center, zoom, map]);
  
  return null;
}

export default function Map({ selectedBuilding, onBuildingClick, categoryFilter }: MapProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEKUT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    async function loadMapData() {
      try {
        const [buildingsRes, roadsRes, poisRes] = await Promise.all([
          fetch('/api/map/buildings'),
          fetch('/api/map/roads'),
          fetch('/api/map/pois'),
        ]);

        const [buildingsData, roadsData, poisData] = await Promise.all([
          buildingsRes.json(),
          roadsRes.json(),
          poisRes.json(),
        ]);

        // Handle both array and object responses
        setBuildings(Array.isArray(buildingsData) ? buildingsData : (buildingsData.data || []));
        setRoads(Array.isArray(roadsData) ? roadsData : (roadsData.data || []));
        setPois(Array.isArray(poisData) ? poisData : (poisData.data || []));
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMapData();
  }, []);

  useEffect(() => {
    if (selectedBuilding && selectedBuilding.center_lat && selectedBuilding.center_lng) {
      setMapCenter([selectedBuilding.center_lat, selectedBuilding.center_lng]);
      setMapZoom(18);
    }
  }, [selectedBuilding]);

  const getCategoryColor = (building: Building): string => {
    if (building.use === 'Hostel' || building.name?.toLowerCase().includes('hostel')) return '#f97316'; // orange - recreation
    if (building.use === 'Lecture Hall' || building.name?.toLowerCase().includes('lecture')) return '#3b82f6'; // blue - academic
    if (building.use === 'Office' || building.building_type === 'office') return '#a855f7'; // purple - administrative
    if (building.amenity === 'clinic' || building.amenity === 'cafe') return '#ef4444'; // red - services
    return '#3b82f6'; // default blue
  };

  const buildingStyle = (feature: any) => {
    const building = buildings.find(b => b.osm_id === feature.properties?.['@id']);
    const color = building ? getCategoryColor(building) : '#3b82f6';
    
    return {
      fillColor: color,
      fillOpacity: 0.4,
      color: color,
      weight: 2,
    };
  };

  const roadStyle = (feature: any) => {
    const roadType = feature.properties?.highway_type || 'path';
    
    const styles: Record<string, any> = {
      tertiary: { color: '#f59e0b', weight: 4, opacity: 0.8 },
      residential: { color: '#8b5cf6', weight: 3, opacity: 0.7 },
      service: { color: '#6b7280', weight: 2, opacity: 0.6 },
      path: { color: '#10b981', weight: 2, opacity: 0.5, dashArray: '5, 5' },
      footway: { color: '#10b981', weight: 1, opacity: 0.5, dashArray: '2, 2' },
      unclassified: { color: '#94a3b8', weight: 2, opacity: 0.6 },
      track: { color: '#a78bfa', weight: 2, opacity: 0.5 },
      trunk: { color: '#ef4444', weight: 5, opacity: 0.9 },
    };
    
    return styles[roadType] || { color: '#cbd5e1', weight: 2, opacity: 0.5 };
  };

  const onEachBuilding = (feature: any, layer: any) => {
    const props = feature.properties;
    const building = buildings.find(b => b.osm_id === props['@id']);
    
    layer.on({
      click: () => {
        if (building && onBuildingClick) {
          onBuildingClick(building);
        }
      },
      mouseover: (e: any) => {
        e.target.setStyle({
          fillOpacity: 0.7,
        });
      },
      mouseout: (e: any) => {
        e.target.setStyle({
          fillOpacity: 0.4,
        });
      },
    });

    if (props.name) {
      layer.bindTooltip(props.name, {
        permanent: false,
        direction: 'top',
      });
    }
  };

  const onEachRoad = (feature: any, layer: any) => {
    const props = feature.properties;
    if (props.name) {
      layer.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${props.name}</h3>
          <p class="text-sm text-gray-600">Type: ${props.highway_type || 'Unknown'}</p>
          ${props.surface ? `<p class="text-sm text-gray-600">Surface: ${props.surface}</p>` : ''}
        </div>
      `);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
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
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={DEKUT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Roads Layer */}
        {roads.map((road) => (
          <GeoJSON
            key={`road-${road.id}`}
            data={road.geometry as any}
            style={roadStyle}
            onEachFeature={onEachRoad}
          />
        ))}

        {/* Buildings Layer */}
        {buildings.map((building) => (
          <GeoJSON
            key={`building-${building.id}`}
            data={building.geometry as any}
            style={buildingStyle}
            onEachFeature={onEachBuilding}
          />
        ))}

        {/* POIs Layer */}
        {pois.map((poi) => {
          if (!poi.lat || !poi.lng) return null;
          
          return (
            <Marker key={`poi-${poi.id}`} position={[poi.lat, poi.lng]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{poi.name || 'Unknown POI'}</h3>
                  {poi.amenity && (
                    <p className="text-sm text-gray-600">Type: {poi.amenity}</p>
                  )}
                  {poi.shop && (
                    <p className="text-sm text-gray-600">Shop: {poi.shop}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Satellite Toggle */}
      <button className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 text-sm font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Satellite
      </button>
    </div>
  );
}