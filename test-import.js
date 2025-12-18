require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function test() {
  console.log('Testing connection...');
  
  // Try to insert one simple building
  const { data, error } = await supabase
    .from('buildings')
    .insert([{
      name: 'Test Building',
      building_type: 'test',
      geometry: { type: 'Point', coordinates: [36.96, -0.39] },
      properties: {}
    }]);

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Success! Connection works!');
  }
}

test();