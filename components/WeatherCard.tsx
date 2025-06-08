import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Droplets, Wind, Thermometer, Eye } from 'lucide-react-native';
import { CityWeather } from '@/types/weather';
import { getWeatherDescription, getWeatherIcon, getWindDirection } from '@/utils/weather';

interface WeatherCardProps {
  cityWeather: CityWeather;
}

export function WeatherCard({ cityWeather }: WeatherCardProps) {
  const { name, country, weather, loading, error } = cityWeather;

  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cityName}>{name}</Text>
          {country && <Text style={styles.country}>{country}</Text>}
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <View style={styles.header}>
          <Text style={styles.cityName}>{name}</Text>
          {country && <Text style={styles.country}>{country}</Text>}
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Failed to load weather data'}
          </Text>
        </View>
      </View>
    );
  }

  const { current, current_units } = weather;
  const weatherIcon = getWeatherIcon(current.weather_code);
  const weatherDesc = getWeatherDescription(current.weather_code);
  const windDirection = getWindDirection(current.wind_direction_10m);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.cityName}>{name}</Text>
          {country && <Text style={styles.country}>{country}</Text>}
        </View>
        <View style={styles.weatherIcon}>
          <Text style={styles.iconText}>{weatherIcon}</Text>
        </View>
      </View>

      <View style={styles.temperatureSection}>
        <Text style={styles.temperature}>
          {Math.round(current.temperature_2m)}{current_units.temperature_2m}
        </Text>
        <Text style={styles.weatherDescription}>{weatherDesc}</Text>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Thermometer size={16} color="#ef4444" />
            <Text style={styles.detailLabel}>Feels like</Text>
          </View>
          <Text style={styles.detailValue}>
            {Math.round(current.apparent_temperature)}{current_units.apparent_temperature}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Eye size={16} color="#3b82f6" />
            <Text style={styles.detailLabel}>Humidity</Text>
          </View>
          <Text style={styles.detailValue}>
            {current.relative_humidity_2m}{current_units.relative_humidity_2m}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Droplets size={16} color="#14b8a6" />
            <Text style={styles.detailLabel}>Precipitation</Text>
          </View>
          <Text style={styles.detailValue}>
            {current.precipitation}{current_units.precipitation}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Wind size={16} color="#8b5cf6" />
            <Text style={styles.detailLabel}>Wind</Text>
          </View>
          <Text style={styles.detailValue}>
            {Math.round(current.wind_speed_10m)} {current_units.wind_speed_10m} {windDirection}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  country: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  weatherIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  temperatureSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
    textAlign: 'center',
  },
});