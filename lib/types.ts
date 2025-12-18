// lib/types.ts
export interface Building {
  id: number;
  osm_id?: string;
  name?: string;
  building_type?: string;
  amenity?: string;
  use?: string;
  level?: string;
  height?: string;
  center_lat?: number;
  center_lng?: number;
  geometry: GeoJSON.Geometry;
  properties?: Record<string, any>;
}

export interface Road {
  id: number;
  osm_id?: string;
  name?: string;
  highway_type?: string;
  surface?: string;
  lanes?: number;
  maxspeed?: string;
  oneway?: string;
  geometry: GeoJSON.Geometry;
  properties?: Record<string, any>;
}

export interface POI {
  id: number;
  osm_id?: string;
  name?: string;
  amenity?: string;
  tourism?: string;
  shop?: string;
  lat?: number;
  lng?: number;
  geometry: GeoJSON.Geometry;
  properties?: Record<string, any>;
}

export type BuildingCategory = 'academic' | 'administrative' | 'services' | 'recreation';

export interface MapFilter {
  categories: BuildingCategory[];
  searchQuery: string;
}