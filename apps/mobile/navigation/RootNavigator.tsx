import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import {
  CampyPlusScreen,
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
          <Stack.Screen name="CampyPlus" component={CampyPlusScreen} />
        </>
      ) : null}
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}
