import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import Analytics from '@/api/Analytics';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export function TripsScreen() {
  const { t } = useTranslation();

  // Track trips screen view
  useFocusEffect(
    useCallback(() => {
      Analytics.track('trips_view', { trips_count: 0 });
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">{t('trips.title')}</ThemedText>
        <ThemedText>{t('trips.placeholder')}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
