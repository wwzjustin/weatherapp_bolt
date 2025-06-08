import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Trash2, MapPin } from 'lucide-react-native';
import { City } from '@/types/weather';

interface CityItemProps {
  city: City;
  onRemove: (cityId: string) => void;
}

export function CityItem({ city, onRemove }: CityItemProps) {
  const handleRemove = () => {
    Alert.alert(
      'Remove City',
      `Are you sure you want to remove ${city.name} from your weather list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => onRemove(city.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MapPin size={20} color="#3b82f6" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cityName}>{city.name}</Text>
          {city.country && <Text style={styles.country}>{city.country}</Text>}
          <Text style={styles.coordinates}>
            {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={handleRemove}
        activeOpacity={0.7}
      >
        <Trash2 size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  country: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  coordinates: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '400',
  },
  removeButton: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 8,
    marginLeft: 12,
  },
});