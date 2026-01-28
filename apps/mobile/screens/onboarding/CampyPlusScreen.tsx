import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Analytics from '../../api/Analytics';
import { CampyPlusContent } from '../../components/CampyPlusContent';
import type { RootStackParamList } from '../../navigation/types';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { onPaywallClosed } from '@/experiments/onPaywallClosed';

export function CampyPlusScreen() {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { completeOnboarding, vehicleType } = useOnboardingStore();

  useEffect(() => {
    Analytics.trackOnboardingStepView('campy_plus', 2, 2);
    Analytics.trackSubscriptionView('onboarding');
  }, []);

  const finishOnboardingToMain = () => {
    Analytics.trackOnboardingComplete(vehicleType ?? undefined);
    completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleSkip = () => {
    const didShowOffer = onPaywallClosed({
      isEligiblePaywall: true,
      isExistingUser: false,
      showOffer: () => navigation.navigate('OneTimeOfferPaywall'),
    });

    // If we just triggered the offer, STOP here.
    if (didShowOffer) return;

    Analytics.trackOnboardingSkip('campy_plus', 2);
    finishOnboardingToMain();
  };


  const handlePurchaseSuccess = () => {
    Analytics.trackOnboardingStepComplete('campy_plus', 2);
    finishOnboardingToMain();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>{t('common.skip')}</Text>
        </Pressable>
      </View>

      <CampyPlusContent onPurchaseSuccess={handlePurchaseSuccess} />
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
  placeholder: {
    width: 50,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#687076',
  },
});
