import type { Coordinates } from "@palmetto/shared";

export async function getLocation() {
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
