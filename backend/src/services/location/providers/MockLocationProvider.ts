import type { Coordinates, LocationResult } from "@robiscoding/shared";
import type { LocationProvider } from "../LocationProvider.js";

const DEFAULT_RESULT: LocationResult = {
  lat: 35.7796,
  lon: -78.6382,
  display_name: "Charlotte, NC",
};

export class MockLocationProvider implements LocationProvider {
  constructor(private readonly overrides: Partial<LocationResult> = {}) {}

  async searchLocation(_query: string): Promise<LocationResult> {
    if (_query === "Charlotte%2C+NC" || _query === "28201") {
      return DEFAULT_RESULT;
    }
    return { ...DEFAULT_RESULT, ...this.overrides };
  }

  async reverseGeocode(_coords: Coordinates): Promise<LocationResult> {
    return { ...DEFAULT_RESULT, ...this.overrides };
  }
}
