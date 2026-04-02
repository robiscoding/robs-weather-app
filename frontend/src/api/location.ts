import type {
  Coordinates,
  LocationResult,
  ReverseGeocodeResponse,
  SearchLocationResponse,
} from "@palmetto/shared";
import { apiRequest } from "@/lib/apiRequest";

export async function getBrowserLocation(): Promise<Coordinates> {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported in this browser.");
  }

  return new Promise<Coordinates>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      reject,
    );
  });
}

export async function fetchLocation(query: string): Promise<LocationResult> {
  const params = new URLSearchParams({ q: query });
  const response = await apiRequest<SearchLocationResponse>(
    `/api/location/search?${params}`,
    { method: "GET" },
  );
  if (!response.success) {
    throw response.error;
  }
  return response.value.data;
}

export async function reverseGeocode(coords: Coordinates): Promise<LocationResult> {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lon: String(coords.lon),
  });
  const response = await apiRequest<ReverseGeocodeResponse>(
    `/api/location/reverse?${params}`,
    { method: "GET" },
  );
  if (!response.success) {
    throw response.error;
  }
  return response.value.data;
}
