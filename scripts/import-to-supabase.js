// scripts/import-to-supabase.js
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('🔐 Loading credentials...');
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Credentials loaded');

function getPolygonCenter(coordinates) {
  const coords = coordinates[0];
  let lat = 0, lng = 0;
  coords.forEach(([lon, lat_]) => {
    lng += lon;
    lat += lat_;
  });
  return {
    lat: lat / coords.length,
    lng: lng / coords.length
  };
}

function getPointCoords(coordinates) {
  return {
    lng: coordinates[0],
    lat: coordinates[1]
  };
}

async function importData() {
  console.log('═══════════════════════════════════════');
  console.log('🚀 DeKUT Data Import to Supabase');
  console.log('═══════════════════════════════════════');

  const geojsonPath = path.join(process.cwd(), 'public', 'map-data', 'dekut-all.geojson');
  console.log('📂 Looking for GeoJSON file...');
  console.log(`   Path: ${geojsonPath}`);
  
  if (!fs.existsSync(geojsonPath)) {
    console.error('❌ GeoJSON file not found!');
    console.error('   Make sure dekut-all.geojson is in public/map-data/');
    process.exit(1);
  }
  
  console.log('✅ File found!');
  const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
  console.log(`📄 Loaded GeoJSON with ${geojsonData.features.length} features`);

  console.log('🧹 Clearing old data...');
  await supabase.from('buildings').delete().neq('id', 0);
  await supabase.from('roads').delete().neq('id', 0);
  await supabase.from('pois').delete().neq('id', 0);
  console.log('  ✓ Cleared old data');

  const buildings = [];
  const roads = [];
  const pois = [];

  geojsonData.features.forEach(feature => {
    const props = feature.properties || {};
    
    if (props.building || props.use === 'Hostel') {
      buildings.push(feature);
    } else if (props.highway) {
      roads.push(feature);
    } else if (props.amenity || props.tourism || props.shop) {
      pois.push(feature);
    }
  });

  console.log(`🏢 Importing buildings...`);
  console.log(`   Found ${buildings.length} buildings`);
  
  let buildingCount = 0;
  const buildingBatch = [];
  
  for (const feature of buildings) {
    const props = feature.properties;
    const center = feature.geometry.type === 'Polygon' 
      ? getPolygonCenter(feature.geometry.coordinates)
      : { lat: null, lng: null };
    
    buildingBatch.push({
      osm_id: props['@id'],
      name: props.name || null,
      building_type: props.building || null,
      amenity: props.amenity || null,
      use: props.use || null,
      level: props.level || null,
      height: props.height || null,
      center_lat: center.lat,
      center_lng: center.lng,
      geometry: feature.geometry,
      properties: props
    });
    
    if (buildingBatch.length >= 50) {
      const { error } = await supabase.from('buildings').insert(buildingBatch);
      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
      } else {
        buildingCount += buildingBatch.length;
        console.log(`   ✅ Batch: ${buildingCount} buildings`);
      }
      buildingBatch.length = 0;
    }
  }
  
  if (buildingBatch.length > 0) {
    const { error } = await supabase.from('buildings').insert(buildingBatch);
    if (!error) {
      buildingCount += buildingBatch.length;
      console.log(`   ✅ Final batch: ${buildingCount} buildings`);
    }
  }
  
  console.log(`✅ Imported ${buildingCount}/${buildings.length} buildings`);

  console.log(`🛣️  Importing roads...`);
  console.log(`   Found ${roads.length} roads`);
  
  let roadCount = 0;
  const roadBatch = [];
  
  for (const feature of roads) {
    const props = feature.properties;
    
    roadBatch.push({
      osm_id: props['@id'],
      name: props.name || null,
      highway_type: props.highway || null,
      surface: props.surface || null,
      lanes: props.lanes ? parseInt(props.lanes) : null,
      maxspeed: props.maxspeed || null,
      oneway: props.oneway || null,
      geometry: feature.geometry,
      properties: props
    });
    
    if (roadBatch.length >= 50) {
      const { error } = await supabase.from('roads').insert(roadBatch);
      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
      } else {
        roadCount += roadBatch.length;
        console.log(`   ✅ Batch: ${roadCount} roads`);
      }
      roadBatch.length = 0;
    }
  }
  
  if (roadBatch.length > 0) {
    const { error } = await supabase.from('roads').insert(roadBatch);
    if (!error) {
      roadCount += roadBatch.length;
      console.log(`   ✅ Final batch: ${roadCount} roads`);
    }
  }
  
  console.log(`✅ Imported ${roadCount}/${roads.length} roads`);

  console.log(`📍 Importing Points of Interest...`);
  console.log(`   Found ${pois.length} POIs`);
  
  let poiCount = 0;
  const poiBatch = [];
  
  for (const feature of pois) {
    const props = feature.properties;
    const coords = feature.geometry.type === 'Point'
      ? getPointCoords(feature.geometry.coordinates)
      : { lat: null, lng: null };
    
    poiBatch.push({
      osm_id: props['@id'],
      name: props.name || null,
      amenity: props.amenity || null,
      tourism: props.tourism || null,
      shop: props.shop || null,
      lat: coords.lat,
      lng: coords.lng,
      geometry: feature.geometry,
      properties: props
    });
    
    if (poiBatch.length >= 50) {
      const { error } = await supabase.from('pois').insert(poiBatch);
      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
      } else {
        poiCount += poiBatch.length;
        console.log(`   ✅ Batch: ${poiCount} POIs`);
      }
      poiBatch.length = 0;
    }
  }
  
  if (poiBatch.length > 0) {
    const { error } = await supabase.from('pois').insert(poiBatch);
    if (!error) {
      poiCount += poiBatch.length;
      console.log(`   ✅ Final batch: ${poiCount} POIs`);
    }
  }
  
  console.log(`✅ Imported ${poiCount}/${pois.length} POIs`);

  console.log('═══════════════════════════════════════');
  console.log('🎉 Import Complete!');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Buildings: ${buildingCount}`);
  console.log(`✅ Roads: ${roadCount}`);
  console.log(`✅ POIs: ${poiCount}`);
  console.log(`📊 Total: ${buildingCount + roadCount + poiCount} records`);
  console.log('═══════════════════════════════════════');
}

importData().catch(console.error);