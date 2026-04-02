import type { Coordinates, LocationResult } from "@robiscoding/shared";

export interface LocationProvider {
  searchLocation(query: string): Promise<LocationResult>;
  reverseGeocode(coords: Coordinates): Promise<LocationResult>;
}
