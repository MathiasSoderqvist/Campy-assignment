import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootNavigator } from '@/navigation';
import { ApolloClientProvider } from './providers/ApolloClientProvider';

function App() {
  const colorScheme = useColorScheme();

  return (
    <ApolloClientProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ApolloClientProvider>
  );
}

registerRootComponent(App);
