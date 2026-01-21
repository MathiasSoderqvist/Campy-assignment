import { useQuery } from '@apollo/client/react';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { FETCH_LOCATIONS_NEARBY } from '../api/graphql_queries';

const AMSTERDAM = {
  latitude: 52.370216,
  longitude: 4.895168,
};

type Location = {
  uid: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
};

export function HomeScreen() {
  const { data, loading, error } = useQuery<{ locations: Location[] }>(
    FETCH_LOCATIONS_NEARBY,
    {
      variables: {
        latitude: AMSTERDAM.latitude,
        longitude: AMSTERDAM.longitude,
        radiusKm: 25,
      },
    }
  );

  const cameraPosition = {
    coordinates: {
      latitude: AMSTERDAM.latitude,
      longitude: AMSTERDAM.longitude,
    },
    zoom: 11,
  };

  const markers = data?.locations.map((location) => ({
    id: location.uid,
    coordinates: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    title: location.title,
    snippet: location.address,
  })) ?? [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading locations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading locations</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  return (
    <>
      {Platform.OS === 'ios' ? (
        <AppleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          properties={{
            isMyLocationEnabled: true,
          }}
          uiSettings={{
            myLocationButtonEnabled: true,
          }}
          markers={markers}
        />
      ) : (
        <GoogleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          properties={{
            isMyLocationEnabled: true,
          }}
          uiSettings={{
            myLocationButtonEnabled: true,
          }}
          markers={markers}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
});
