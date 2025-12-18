'use client';

import { useState } from 'react';

export default function ImportPage() {
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState({ buildings: 0, roads: 0, pois: 0 });

  const importData = async () => {
    setIsImporting(true);
    setStatus('Starting import...');
    setProgress(10);

    try {
      // Get Supabase credentials
      const supabaseUrl = 'https://linjscyayxawjdwzzvie.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidHJxeWtkYWNtYnJ3bnJtbnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODA4MjIsImV4cCI6MjA4MTU1NjgyMn0.ILHZDusofBIEATrS5weqNwnztCcPywEnYjHSTefYo9g';

      // Fetch GeoJSON
      setStatus('Fetching GeoJSON file...');
      setProgress(20);
      
      const response = await fetch('/map-data/dekut-all.geojson');
      if (!response.ok) throw new Error('Failed to fetch GeoJSON');
      
      const geojson = await response.json();
      setStatus(`Found ${geojson.features.length} features`);
      setProgress(30);

      // Separate features
      const buildings: any[] = [];
      const roads: any[] = [];
      const pois: any[] = [];

      geojson.features.forEach((feature: any) => {
        const props = feature.properties || {};
        const geom = feature.geometry;
        if (!geom) return;

        const baseData = {
          osm_id: props.id || props.osm_id || `gen_${Math.random().toString(36).substr(2, 9)}`,
          name: props.name || 'Unnamed',
          geometry: geom
        };

        if (props.building || geom.type === 'Polygon') {
          buildings.push({
            ...baseData,
            building_type: props.building || props.amenity || 'yes',
            levels: props['building:levels'] ? parseInt(props['building:levels']) : null,
            amenity: props.amenity || null
          });
        } else if (props.highway || geom.type === 'LineString') {
          roads.push({
            ...baseData,
            highway: props.highway || 'unclassified',
            surface: props.surface || null,
            width: props.width ? parseFloat(props.width) : null
          });
        } else {
          pois.push({
            ...baseData,
            amenity: props.amenity || props.leisure || props.shop || 'other',
            description: props.description || null
          });
        }
      });

      setStatus(`Categorized: ${buildings.length} buildings, ${roads.length} roads, ${pois.length} POIs`);
      setProgress(40);

      // Import buildings
      if (buildings.length > 0) {
        setStatus(`Importing ${buildings.length} buildings...`);
        const res = await fetch(`${supabaseUrl}/rest/v1/buildings`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(buildings)
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Buildings: ${err}`);
        }
        setResults(prev => ({ ...prev, buildings: buildings.length }));
        setProgress(60);
      }

      // Import roads
      if (roads.length > 0) {
        setStatus(`Importing ${roads.length} roads...`);
        const res = await fetch(`${supabaseUrl}/rest/v1/roads`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(roads)
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Roads: ${err}`);
        }
        setResults(prev => ({ ...prev, roads: roads.length }));
        setProgress(80);
      }

      // Import POIs
      if (pois.length > 0) {
        setStatus(`Importing ${pois.length} POIs...`);
        const res = await fetch(`${supabaseUrl}/rest/v1/pois`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(pois)
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`POIs: ${err}`);
        }
        setResults(prev => ({ ...prev, pois: pois.length }));
        setProgress(100);
      }

      setStatus('✅ Import completed successfully!');
      setIsImporting(false);

    } catch (error: unknown) {
      console.error('Import error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`❌ Error: ${errorMessage}`);
      setIsImporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🗺️ DeKUT GIS Data Import
          </h1>
          <p className="text-gray-600 mb-8">
            Import GeoJSON data to Supabase database
          </p>

          <div className="space-y-6">
            {isImporting && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">{Math.round(progress)}%</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 min-h-[80px] flex items-center">
              <p className="text-gray-700 font-medium">{status || 'Ready to import'}</p>
            </div>

            {(results.buildings > 0 || results.roads > 0 || results.pois > 0) && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{results.buildings}</div>
                  <div className="text-sm text-gray-600">Buildings</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{results.roads}</div>
                  <div className="text-sm text-gray-600">Roads</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">{results.pois}</div>
                  <div className="text-sm text-gray-600">POIs</div>
                </div>
              </div>
            )}

            <button
              onClick={importData}
              disabled={isImporting}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                isImporting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              {isImporting ? '⏳ Importing...' : '🚀 Start Import'}
            </button>

            {progress === 100 && (
              <a 
                href="/"
                className="block w-full py-4 text-center rounded-lg font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                ← Back to Map
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}