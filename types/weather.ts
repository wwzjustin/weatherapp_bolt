export interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    apparent_temperature: string;
    relative_humidity_2m: string;
    precipitation: string;
    wind_speed_10m: string;
  };
}

export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface CityWeather extends City {
  weather?: WeatherData;
  loading?: boolean;
  error?: string;
}

export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}