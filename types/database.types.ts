// types/database.types.ts
export interface BuildingCategory {
  id: number;
  name: string;
  color: string;
  icon: string | null;
  display_order: number;
  created_at: string;
}

export interface BuildingDetails {
  id: number;
  building_id: number;
  description: string | null;
  opening_hours: string | null;
  facilities_count: number;
  contact_phone: string | null;
  contact_email: string | null;
  website_url: string | null;
  image_url: string | null;
  floor_count: number | null;
  accessibility_features: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Building {
  id: number;
  osm_id: string | null;
  name: string | null;
  building_type: string | null;
  amenity: string | null;
  use: string | null;
  level: string | null;
  height: string | null;
  center_lat: number;
  center_lng: number;
  geometry: any;
  properties: any;
  created_at: string;
  category_id: number | null;
  category?: BuildingCategory;
  details?: BuildingDetails;
}

export interface UserSettings {
  id: number;
  user_id: string;
  show_landmarks: boolean;
  buildings_3d: boolean;
  satellite_view: boolean;
  voice_navigation: boolean;
  vibration_alerts: boolean;
  auto_rerouting: boolean;
  dark_mode: boolean;
  notifications: boolean;
  location_tracking: boolean;
  created_at: string;
  updated_at: string;
}