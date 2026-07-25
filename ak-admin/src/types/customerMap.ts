export interface CustomerMapItem {
  id: string;
  customer_name: string;
  phone_number: string;
  place: string;
  latitude: number | null;
  longitude: number | null;
  installation_date: string;
  product_name: string;
  status: "Active" | "Inactive" | "AMC Due Soon" | "Unknown";
  maintenance_period: number;
  remark: string | null;
  created_at?: string;
  updated_at?: string;
  distance_km?: number;
}

export type MapStatusFilter = "All" | "Active" | "Inactive" | "AMC Due Soon" | "Unknown";

export interface MapFiltersState {
  searchQuery: string;
  status: MapStatusFilter;
  productName: string;
  startDate: string;
  endDate: string;
}

export interface MapStatistics {
  total: number;
  active: number;
  inactive: number;
  amcDueToday: number;
  amcDueThisWeek: number;
}

export interface RadiusSearchParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

// Helper to safely format raw lat/lng values as numbers or null
export function parseCoordinates(rawLat?: any, rawLng?: any): { lat: number | null; lng: number | null } {
  if (rawLat !== null && rawLat !== undefined && rawLat !== "" && rawLng !== null && rawLng !== undefined && rawLng !== "") {
    const lat = Number(rawLat);
    const lng = Number(rawLng);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  return { lat: null, lng: null };
}
