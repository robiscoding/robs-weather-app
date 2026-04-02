import type { Coordinates, LocationResult } from "@palmetto/shared";
import type { LocationProvider } from "../LocationProvider.ts";

const NOMINATIM_HEADERS = {
  "Accept-Language": "en",
  "User-Agent": "robiscoding-weather-app/1.0",
};
const BASE_URL = "https://nominatim.openstreetmap.org";

export class NominatimLocationProvider implements LocationProvider {
  async searchLocation(query: string): Promise<LocationResult> {
    const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const response = await fetch(url, { headers: NOMINATIM_HEADERS });

    if (!response.ok) {
      throw new Error(`Nominatim search failed: ${response.statusText}`);
    }

    const results = (await response.json()) as NominatimSearchResult[];

    if (results.length === 0) {
      throw new Error(`No results found for query: "${query}"`);
    }

    return {
      lat: parseFloat(results[0].lat),
      lon: parseFloat(results[0].lon),
      display_name: results[0].display_name,
    };
  }

  async reverseGeocode(coords: Coordinates): Promise<LocationResult> {
    const url = `${BASE_URL}/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`;
    const response = await fetch(url, { headers: NOMINATIM_HEADERS });

    if (!response.ok) {
      throw new Error(
        `Nominatim reverse geocode failed: ${response.statusText}`,
      );
    }

    const result = (await response.json()) as NominatimReverseResult;

    let display_name = result.display_name;
    if (result.address?.city && result.address?.state) {
      display_name = `${result.address.city}, ${result.address.state}`;
    }

    return {
      lat: coords.lat,
      lon: coords.lon,
      display_name,
    };
  }
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface NominatimReverseResult {
  display_name: string;
  address?: {
    city?: string;
    state?: string;
  };
}
