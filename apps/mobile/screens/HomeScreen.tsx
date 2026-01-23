import { useQuery } from '@apollo/client/react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Analytics from '../api/Analytics';
import { FETCH_LOCATIONS_NEARBY } from '../api/graphql_queries';
import type { RootStackParamList } from '../navigation/types';
import type { Location as CampyLocation } from '../types/location';

const AMSTERDAM = {
  latitude: 52.370216,
  longitude: 4.895168,
};

export function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const { data, loading, error } = useQuery<{ locations: CampyLocation[] }>(
    FETCH_LOCATIONS_NEARBY,
    {
      variables: {
        latitude: AMSTERDAM.latitude,
        longitude: AMSTERDAM.longitude,
        radiusKm: 25,
      },
    }
  );

  // Request location permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermissionGranted(status === 'granted');
    })();
  }, []);

  const handlePlusPress = () => {
    Analytics.trackSubscriptionView('home');
    navigation.navigate('CampyPlusModal');
  };

  // Track map loaded with locations count
  useEffect(() => {
    if (data?.locations && !loading) {
      Analytics.trackMapLoaded(data.locations.length);
      Analytics.trackSearchResults(data.locations.length);
    }
  }, [data?.locations, loading]);

  // Track API errors
  useEffect(() => {
    if (error) {
      Analytics.trackErrorDisplayed('api_error', error.message, 'HomeScreen');
    }
  }, [error]);

  const handleMarkerPress = useCallback(
    (markerId: string) => {
      const campyLocation = data?.locations.find((loc) => loc.uid === markerId);
      if (campyLocation) {
        Analytics.trackMapMarkerClick({
          location_id: campyLocation.uid,
          location_name: campyLocation.title,
          location_rating: campyLocation.rating,
          location_latitude: campyLocation.latitude,
          location_longitude: campyLocation.longitude,
        });
        navigation.navigate('LocationDetails', { location: campyLocation });
      }
    },
    [data?.locations, navigation]
  );

  const cameraPosition = {
    coordinates: {
      latitude: AMSTERDAM.latitude,
      longitude: AMSTERDAM.longitude,
    },
    zoom: 11,
  };

  const markers = data?.locations.map((loc) => ({
    id: loc.uid,
    coordinates: {
      latitude: loc.latitude,
      longitude: loc.longitude,
    },
    title: loc.title,
    snippet: loc.address,
  })) ?? [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{t('home.loadingLocations')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t('home.errorLoadingLocations')}</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <AppleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          properties={{
            isMyLocationEnabled: locationPermissionGranted,
          }}
          uiSettings={{
            myLocationButtonEnabled: locationPermissionGranted,
          }}
          markers={markers}
          onMarkerClick={(event) => event.id && handleMarkerPress(event.id)}
        />
      ) : (
        <GoogleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          properties={{
            isMyLocationEnabled: locationPermissionGranted,
          }}
          uiSettings={{
            myLocationButtonEnabled: locationPermissionGranted,
          }}
          markers={markers}
          onMarkerClick={(event) => event.id && handleMarkerPress(event.id)}
        />
      )}
      <Pressable
        style={[styles.plusButton, { bottom: insets.bottom + 100 }]}
        onPress={handlePlusPress}
      >
        <Text style={styles.plusText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  errorDetail: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  plusButton: {
    position: 'absolute',
    left: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  plusText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#fff',
    marginTop: -2,
  },
});
