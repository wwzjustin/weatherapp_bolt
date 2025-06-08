import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { CityItem } from '@/components/CityItem';
import { AddCityModal } from '@/components/AddCityModal';
import { useCities } from '@/hooks/useCities';

export default function CitiesTab() {
  const { cities, loading, addCity, removeCity, searchCities } = useCities();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddCity = async (city: Parameters<typeof addCity>[0]) => {
    try {
      await addCity(city);
    } catch (error) {
      console.error('Failed to add city:', error);
      // In a real app, you might want to show an error toast
    }
  };

  const handleRemoveCity = async (cityId: string) => {
    try {
      await removeCity(cityId);
    } catch (error) {
      console.error('Failed to remove city:', error);
      // In a real app, you might want to show an error toast
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cities</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading cities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Cities</Text>
            <Text style={styles.subtitle}>
              {cities.length} {cities.length === 1 ? 'city' : 'cities'} added
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.7}
          >
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {cities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No cities added yet</Text>
            <Text style={styles.emptyDescription}>
              Tap the + button to add your first city and start tracking weather.
            </Text>
            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.7}
            >
              <Plus size={24} color="#3b82f6" />
              <Text style={styles.emptyAddButtonText}>Add Your First City</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cities.map((city) => (
              <CityItem
                key={city.id}
                city={city}
                onRemove={handleRemoveCity}
              />
            ))}
            <View style={styles.bottomPadding} />
          </>
        )}
      </ScrollView>

      <AddCityModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddCity={handleAddCity}
        searchCities={searchCities}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
  },
  emptyAddButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});