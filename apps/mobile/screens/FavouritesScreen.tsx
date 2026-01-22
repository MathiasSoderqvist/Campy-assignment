import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/types';
import { useFavoritesStore } from '../stores/favoritesStore';
import type { Location } from '../types/location';

export function FavouritesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { favorites, removeFavorite } = useFavoritesStore();

  const handleLocationPress = (location: Location) => {
    navigation.navigate('LocationDetails', { location });
  };

  const renderItem = ({ item }: { item: Location }) => (
    <Pressable style={styles.card} onPress={() => handleLocationPress(item)}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardAddress} numberOfLines={1}>
          {item.address}
        </Text>
        {item.rating !== undefined && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      <Pressable
        style={styles.removeButton}
        onPress={() => removeFavorite(item.uid)}
        hitSlop={8}
      >
        <Text style={styles.removeIcon}>♥</Text>
      </Pressable>
    </Pressable>
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('favourites.title')}</Text>
        </View>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>{t('favourites.noFavouritesTitle')}</Text>
          <Text style={styles.emptyText}>
            {t('favourites.noFavouritesMessage')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('favourites.title')}</Text>
        <Text style={styles.count}>{t('favourites.saved', { count: favorites.length })}</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.uid}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
  },
  count: {
    fontSize: 14,
    color: '#687076',
  },
  listContent: {
    paddingHorizontal: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
  },
  cardAddress: {
    fontSize: 14,
    color: '#687076',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingStar: {
    fontSize: 14,
    color: '#FFB800',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
  },
  removeIcon: {
    fontSize: 24,
    color: '#FF3B30',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    color: '#E5E5E5',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#687076',
    textAlign: 'center',
    lineHeight: 24,
  },
});
