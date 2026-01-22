import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/types';
import { useFavoritesStore } from '../stores/favoritesStore';

export function LocationDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'LocationDetails'>>();
  const insets = useSafeAreaInsets();
  const { location } = route.params;

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isLocationFavorite = isFavorite(location.uid);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(location);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeText}>{t('common.close')}</Text>
        </Pressable>
        <Pressable onPress={handleToggleFavorite} style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>{isLocationFavorite ? '♥' : '♡'}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {location.imageUrl ? (
          <Image source={{ uri: location.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>{t('locationDetails.noImage')}</Text>
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.title}>{location.title}</Text>
          <Text style={styles.address}>{location.address}</Text>

          {location.rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingText}>{location.rating.toFixed(1)}</Text>
              {location.reviewCount !== undefined && (
                <Text style={styles.reviewCount}>({location.reviewCount} {t('locationDetails.reviews')})</Text>
              )}
            </View>
          )}

          {location.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>{t('locationDetails.about')}</Text>
              <Text style={styles.description}>{location.description}</Text>
            </View>
          )}

          <View style={styles.coordinatesContainer}>
            <Text style={styles.sectionTitle}>{t('locationDetails.location')}</Text>
            <Text style={styles.coordinates}>
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[
            styles.favoriteButtonLarge,
            isLocationFavorite && styles.favoriteButtonLargeActive,
          ]}
          onPress={handleToggleFavorite}
        >
          <Text
            style={[
              styles.favoriteButtonText,
              isLocationFavorite && styles.favoriteButtonTextActive,
            ]}
          >
            {isLocationFavorite ? t('locationDetails.removeFromFavorites') : t('locationDetails.addToFavorites')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#687076',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#FF3B30',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#E5E5E5',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#687076',
  },
  details: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
  },
  address: {
    fontSize: 16,
    color: '#687076',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  ratingStar: {
    fontSize: 18,
    color: '#FFB800',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#687076',
    marginLeft: 8,
  },
  descriptionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#687076',
    lineHeight: 24,
  },
  coordinatesContainer: {
    marginTop: 24,
  },
  coordinates: {
    fontSize: 14,
    color: '#687076',
    fontFamily: 'monospace',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  favoriteButtonLarge: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  favoriteButtonLargeActive: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  favoriteButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  favoriteButtonTextActive: {
    color: '#11181C',
  },
});
