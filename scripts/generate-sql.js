const fs = require('fs');
const path = require('path');

// Read GeoJSON file
const filePath = path.join(__dirname, '../public/map-data/dekut-all.geojson');
const geojson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let buildingsSQL = '';
let roadsSQL = '';
let poisSQL = '';

geojson.features.forEach((feature, index) => {
  const props = feature.properties || {};
  const geom = feature.geometry;
  if (!geom) return;

  const osmId = (props.id || props.osm_id || `gen_${index}`).replace(/'/g, "''");
  const name = (props.name || 'Unnamed').replace(/'/g, "''");
  const geomJSON = JSON.stringify(geom).replace(/'/g, "''");

  // Calculate center point for buildings
  if (props.building || geom.type === 'Polygon') {
    let centerLat = 0, centerLng = 0, count = 0;
    if (geom.coordinates && geom.coordinates[0]) {
      geom.coordinates[0].forEach(coord => {
        centerLng += coord[0];
        centerLat += coord[1];
        count++;
      });
      if (count > 0) {
        centerLat /= count;
        centerLng /= count;
      }
    }

    const buildingType = props.building ? `'${props.building.replace(/'/g, "''")}'` : 'NULL';
    const amenity = props.amenity ? `'${props.amenity.replace(/'/g, "''")}'` : 'NULL';
    const use = props.use ? `'${props.use.replace(/'/g, "''")}'` : 'NULL';
    const level = props['building:levels'] ? parseInt(props['building:levels']) : 'NULL';
    const height = props.height ? parseFloat(props.height) : 'NULL';
    
    buildingsSQL += `INSERT INTO buildings (osm_id, name, building_type, amenity, use, level, height, center_lat, center_lng, geometry) VALUES ('${osmId}', '${name}', ${buildingType}, ${amenity}, ${use}, ${level}, ${height}, ${centerLat}, ${centerLng}, '${geomJSON}'::jsonb);\n`;
  } 
  else if (props.highway || geom.type === 'LineString') {
    roadsSQL += `INSERT INTO roads (osm_id, name, geometry) VALUES ('${osmId}', '${name}', '${geomJSON}'::jsonb);\n`;
  } 
  else {
    poisSQL += `INSERT INTO pois (osm_id, name, geometry) VALUES ('${osmId}', '${name}', '${geomJSON}'::jsonb);\n`;
  }
});

// Write SQL files
fs.writeFileSync(path.join(__dirname, 'insert-buildings.sql'), buildingsSQL);
fs.writeFileSync(path.join(__dirname, 'insert-roads.sql'), roadsSQL);
fs.writeFileSync(path.join(__dirname, 'insert-pois.sql'), poisSQL);

console.log('✅ SQL files generated:');
console.log(`   - Buildings: ${buildingsSQL.split('\n').length - 1} records`);
console.log(`   - Roads: ${roadsSQL.split('\n').length - 1} records`);
console.log(`   - POIs: ${poisSQL.split('\n').length - 1} records`);
console.log('\nCopy each SQL file content into Supabase SQL Editor and run');