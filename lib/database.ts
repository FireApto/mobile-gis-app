import { supabase } from './supabase';

export const DatabaseService = {
  // Fetch all buildings
  async getBuildings() {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .limit(50); // Get first 50 buildings

      if (error) throw error;

      return (data || []).map(building => ({
        id: building.id,
        name: building.name || 'Unnamed Building',
        category: building.building_type || 'Other',
        description: building.amenity || 'Campus building',
        coordinates: {
          lat: building.center_lat,
          lng: building.center_lng
        }
      }));
    } catch (error) {
      console.error('Error fetching buildings:', error);
      return [];
    }
  }
};