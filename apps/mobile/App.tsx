import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type NavigationContainerRef,
} from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/i18n';
import Firebase from '@/api/Firebase';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootNavigator } from '@/navigation';
import type { RootStackParamList } from '@/navigation/types';
import { ApolloClientProvider } from './providers/ApolloClientProvider';
import { RemoteConfigProvider } from './providers/RemoteConfigProvider';

// Initialize Firebase
Firebase.init();

function App() {
  const colorScheme = useColorScheme();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  const onReady = useCallback(() => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
  }, []);

  const onStateChange = useCallback(() => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName && currentRouteName) {
      // Track screen view
      Firebase.track('screen_view', {
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });

      // Performance traces on Android
      if (Platform.OS === 'android') {
        if (previousRouteName) {
          Firebase.stopScreenTrace(previousRouteName);
        }
        Firebase.screenTrace(currentRouteName);
      }
    }

    routeNameRef.current = currentRouteName;
  }, []);

  return (
    <ApolloClientProvider>
      <RemoteConfigProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={onReady}
              onStateChange={onStateChange}
              theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </RemoteConfigProvider>
    </ApolloClientProvider>
  );
}

registerRootComponent(App);
