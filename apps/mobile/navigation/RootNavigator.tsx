import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { CampyPlusScreen } from '../screens/CampyPlusScreen';
import { OneTimeOfferPaywallScreen } from '../screens/OneTimeOfferPaywallScreen';
import { LocationDetailsScreen } from '../screens/LocationDetailsScreen';
import {
  CampyPlusScreen as CampyPlusOnboardingScreen,
  VehiclePreferencesScreen,
} from '../screens/onboarding';
import { useOnboardingStore } from '../stores/onboardingStore';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isOnboardingCompleted = useOnboardingStore(
    (state) => state.isOnboardingCompleted
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboardingCompleted ? (
        <>
          <Stack.Screen
            name="VehiclePreferences"
            component={VehiclePreferencesScreen}
          />
          <Stack.Screen name="CampyPlus" component={CampyPlusOnboardingScreen} />
        </>
      ) : null}
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="CampyPlusModal"
        component={CampyPlusScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="OneTimeOfferPaywall"
        component={OneTimeOfferPaywallScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="LocationDetails"
        component={LocationDetailsScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
