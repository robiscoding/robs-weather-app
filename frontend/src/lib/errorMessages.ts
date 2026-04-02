const INTERNAL_MESSAGES = new Set(["API_URL is not set", "Invalid path"]);

function geolocationErrorMessage(error: unknown): string | undefined {
  const Geo = (
    globalThis as typeof globalThis & {
      GeolocationPositionError?: typeof GeolocationPositionError;
    }
  ).GeolocationPositionError;

  if (Geo !== undefined && error instanceof Geo) {
    switch (error.code) {
      case Geo.PERMISSION_DENIED:
        return "Location access was denied. Please search manually.";
      case Geo.POSITION_UNAVAILABLE:
        return "Your location could not be determined. Please search manually.";
      case Geo.TIMEOUT:
        return "Location request timed out. Please search manually.";
    }
    return undefined;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "number"
  ) {
    switch ((error as { code: number }).code) {
      case 1:
        return "Location access was denied. Please search manually.";
      case 2:
        return "Your location could not be determined. Please search manually.";
      case 3:
        return "Location request timed out. Please search manually.";
    }
  }

  return undefined;
}

export function getErrorMessage(error: unknown): string {
  const geo = geolocationErrorMessage(error);
  if (geo !== undefined) return geo;

  if (error instanceof Error) {
    if (INTERNAL_MESSAGES.has(error.message)) {
      return "Service is temporarily unavailable.";
    }
    if (error.message && error.message !== "An error occurred") {
      return error.message;
    }
  }

  return "Something went wrong. Please try again.";
}
