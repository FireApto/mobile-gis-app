import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://linjscyayxawjdwzzvie.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseKey) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY not found in .env.local' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read GeoJSON file
    const filePath = path.join(process.cwd(), 'public', 'map-data', 'dekut-all.geojson');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'GeoJSON file not found at /public/map-data/dekut-all.geojson' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const geojson = JSON.parse(fileContent);

    // Separate features by type
    const buildings: any[] = [];
    const roads: any[] = [];
    const pois: any[] = [];

    geojson.features.forEach((feature: any) => {
      const props = feature.properties || {};
      const geom = feature.geometry;

      if (!geom) return;

      const baseData = {
        osm_id: props.id || props.osm_id || `generated_${Math.random().toString(36).substr(2, 9)}`,
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

    // Import buildings
    if (buildings.length > 0) {
      const { error } = await supabase.from('buildings').insert(buildings);
      if (error) throw new Error(`Buildings import failed: ${error.message}`);
    }

    // Import roads
    if (roads.length > 0) {
      const { error } = await supabase.from('roads').insert(roads);
      if (error) throw new Error(`Roads import failed: ${error.message}`);
    }

    // Import POIs
    if (pois.length > 0) {
      const { error } = await supabase.from('pois').insert(pois);
      if (error) throw new Error(`POIs import failed: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      results: {
        buildings: buildings.length,
        roads: roads.length,
        pois: pois.length,
        total: buildings.length + roads.length + pois.length
      }
    });

  } catch (error: unknown) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}