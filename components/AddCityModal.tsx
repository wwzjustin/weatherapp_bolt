import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search, MapPin, Plus } from 'lucide-react-native';
import { GeocodeResult } from '@/types/weather';

interface AddCityModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCity: (city: Omit<GeocodeResult, 'id'>) => void;
  searchCities: (query: string) => Promise<GeocodeResult[]>;
}

export function AddCityModal({ visible, onClose, onAddCity, searchCities }: AddCityModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await searchCities(searchQuery);
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        setError('No cities found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to search cities. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = (city: GeocodeResult) => {
    onAddCity({
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country,
    });
    setQuery('');
    setResults([]);
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Add City</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a city..."
              value={query}
              onChangeText={handleSearch}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
        </View>

        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Searching cities...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && query.trim().length < 2 && (
            <View style={styles.instructionContainer}>
              <Search size={48} color="#d1d5db" />
              <Text style={styles.instructionTitle}>Search for cities</Text>
              <Text style={styles.instructionText}>
                Type at least 2 characters to search for cities around the world.
              </Text>
            </View>
          )}

          {results.map((city) => (
            <TouchableOpacity
              key={city.id}
              style={styles.resultItem}
              onPress={() => handleAddCity(city)}
              activeOpacity={0.7}
            >
              <View style={styles.resultContent}>
                <View style={styles.resultIconContainer}>
                  <MapPin size={20} color="#3b82f6" />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultName}>{city.name}</Text>
                  <Text style={styles.resultCountry}>
                    {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                  </Text>
                  <Text style={styles.resultCoordinates}>
                    {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
              <View style={styles.addButton}>
                <Plus size={20} color="#3b82f6" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#1f2937',
  },
  resultsContainer: {
    flex: 1,
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
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
    textAlign: 'center',
  },
  instructionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultItem: {
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
  resultContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIconContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  resultCountry: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  resultCoordinates: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '400',
  },
  addButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 8,
    marginLeft: 12,
  },
});