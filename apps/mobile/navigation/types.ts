import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  VehiclePreferences: undefined;
  CampyPlus: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type MainTabParamList = {
  Home: undefined;
  Trips: undefined;
  Favourites: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
