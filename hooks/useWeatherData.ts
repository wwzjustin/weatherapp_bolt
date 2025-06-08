import { useState, useEffect } from 'react';
import { WeatherData, City, CityWeather } from '@/types/weather';

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';

export function useWeatherData(cities: City[]): CityWeather[] {
  const [weatherData, setWeatherData] = useState<CityWeather[]>([]);

  useEffect(() => {
    const fetchWeatherForCities = async () => {
      if (cities.length === 0) {
        setWeatherData([]);
        return;
      }

      // Initialize with loading state
      setWeatherData(
        cities.map(city => ({ ...city, loading: true, error: undefined }))
      );

      // Fetch weather for each city
      const weatherPromises = cities.map(async (city) => {
        try {
          const params = new URLSearchParams({
            latitude: city.latitude.toString(),
            longitude: city.longitude.toString(),
            current: [
              'temperature_2m',
              'apparent_temperature',
              'relative_humidity_2m',
              'precipitation',
              'wind_speed_10m',
              'wind_direction_10m',
              'weather_code'
            ].join(','),
          });

          const response = await fetch(`${WEATHER_API_BASE}?${params}`);
          
          if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
          }

          const weather: WeatherData = await response.json();
          
          return {
            ...city,
            weather,
            loading: false,
            error: undefined,
          };
        } catch (error) {
          return {
            ...city,
            weather: undefined,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch weather',
          };
        }
      });

      const results = await Promise.all(weatherPromises);
      setWeatherData(results);
    };

    fetchWeatherForCities();
  }, [cities]);

  return weatherData;
}