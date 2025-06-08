import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { City, GeocodeResult } from '@/types/weather';

const CITIES_STORAGE_KEY = '@weather_app_cities';
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

const DEFAULT_CITIES: City[] = [
  {
    id: '1',
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    country: 'United States',
  },
  {
    id: '2',
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'United Kingdom',
  },
  {
    id: '3',
    name: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    country: 'Japan',
  },
];

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const stored = await AsyncStorage.getItem(CITIES_STORAGE_KEY);
      if (stored) {
        setCities(JSON.parse(stored));
      } else {
        // Use default cities if no stored data
        setCities(DEFAULT_CITIES);
        await AsyncStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(DEFAULT_CITIES));
      }
    } catch (error) {
      console.error('Failed to load cities:', error);
      setCities(DEFAULT_CITIES);
    } finally {
      setLoading(false);
    }
  };

  const saveCities = async (newCities: City[]) => {
    try {
      await AsyncStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(newCities));
      setCities(newCities);
    } catch (error) {
      console.error('Failed to save cities:', error);
      throw error;
    }
  };

  const addCity = async (city: Omit<City, 'id'>) => {
    const newCity: City = {
      ...city,
      id: Date.now().toString(),
    };
    const updatedCities = [...cities, newCity];
    await saveCities(updatedCities);
  };

  const removeCity = async (cityId: string) => {
    const updatedCities = cities.filter(city => city.id !== cityId);
    await saveCities(updatedCities);
  };

  const searchCities = async (query: string): Promise<GeocodeResult[]> => {
    if (query.trim().length < 2) return [];

    try {
      const params = new URLSearchParams({
        name: query.trim(),
        count: '10',
        language: 'en',
        format: 'json',
      });

      const response = await fetch(`${GEOCODING_API_BASE}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Failed to search cities:', error);
      return [];
    }
  };

  return {
    cities,
    loading,
    addCity,
    removeCity,
    searchCities,
  };
}