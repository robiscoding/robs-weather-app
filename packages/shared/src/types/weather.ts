export type WeatherUnits = "metric" | "imperial" | "standard";

export type Coordinates = {
  lat: number;
  lon: number;
};

export type WeatherCondition = {
  code: number;
  label: string;
  icon?: string;
};

export type WeatherForecast = {
  timestamp: string; // ISO string
  location: Coordinates;
  units: WeatherUnits;

  condition: WeatherCondition;

  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;

  humidity: number;
  visibility?: number;

  wind?: {
    speed: number;
    deg: number;
    gust?: number;
  };
};
