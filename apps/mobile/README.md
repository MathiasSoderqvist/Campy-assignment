# Campy Mobile App

React Native mobile application for discovering camping locations, built with Expo.

## Overview

The Campy mobile app provides users with an interactive map interface to discover camping locations, manage favorites, and plan trips. It features Firebase integration for authentication and analytics, multi-language support, and a premium subscription flow.

## Tech Stack

- **React Native 0.81** - Cross-platform mobile framework
- **Expo 54** - Development platform and build tools
- **Apollo Client** - GraphQL client
- **React Navigation 7** - Navigation framework
- **Zustand** - State management with AsyncStorage persistence
- **Firebase** - Authentication, Analytics, Performance, Remote Config
- **i18next** - Internationalization
- **expo-maps** - Native maps integration

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0
- iOS: Xcode and CocoaPods
- Android: Android Studio and JDK

### Installation

```bash
cd apps/mobile
pnpm install
```

### iOS Setup

```bash
cd ios
pod install
cd ..
```

### Running the App

```bash
# Start Expo development server
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run on web
pnpm web
```

### Build

```bash
# Development build
npx expo prebuild

# Production build (requires EAS CLI)
eas build --platform ios
eas build --platform android
```

## Project Structure

```
apps/mobile/
├── screens/                    # Screen components
│   ├── HomeScreen.tsx          # Map view with locations
│   ├── LoginScreen.tsx         # Authentication
│   ├── FavouritesScreen.tsx    # Saved locations
│   ├── ProfileScreen.tsx       # User profile & settings
│   ├── TripsScreen.tsx         # Trip history
│   ├── LocationDetailsScreen.tsx # Location details modal
│   ├── CampyPlusScreen.tsx     # Premium subscription
│   └── onboarding/             # Onboarding flow screens
├── navigation/                 # Navigation configuration
│   ├── RootNavigator.tsx       # Main navigation orchestrator
│   ├── TabNavigator.tsx        # Bottom tab navigation
│   └── types.ts                # Navigation TypeScript types
├── stores/                     # Zustand state stores
│   ├── authStore.ts            # Authentication state
│   ├── favoritesStore.ts       # Favorites management
│   └── onboardingStore.ts      # Onboarding state
├── providers/                  # React context providers
│   ├── ApolloClientProvider.tsx # GraphQL client setup
│   └── RemoteConfigProvider.tsx # Firebase remote config
├── api/                        # API integration
│   ├── graphql_queries.ts      # GraphQL operations
│   └── Firebase.ts             # Firebase service class
├── components/                 # Reusable UI components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
├── types/                      # TypeScript type definitions
├── lang/                       # i18n translation files
│   ├── en.json                 # English
│   ├── nl.json                 # Dutch
│   ├── de.json                 # German
│   ├── it.json                 # Italian
│   ├── fr.json                 # French
│   └── es.json                 # Spanish
├── config/                     # Configuration files
├── constants/                  # App constants
├── App.tsx                     # App entry point
├── app.json                    # Expo configuration
└── package.json
```

## Features

### Map & Location Discovery

- Interactive map with camping location markers
- Apple Maps on iOS, Google Maps on Android
- Proximity-based location search via GraphQL API
- Tap markers to view location details

### User Authentication

- Firebase Authentication integration
- Persistent login state via AsyncStorage
- Auto token refresh
- Profile management

### Favorites Management

- Save/remove favorite camping locations
- Persistent storage across sessions
- Dedicated favorites screen with list view
- Quick toggle from location details

### Onboarding Flow

- Vehicle type selection (motorhome, rooftent, bicycle, car, van)
- Campy Plus subscription introduction
- Skippable screens
- State persisted across app restarts

### Internationalization

Supports 6 languages with automatic device language detection:
- English (en) - Default
- Dutch (nl)
- German (de)
- Italian (it)
- French (fr)
- Spanish (es)

### Firebase Integration

- **Analytics** - Event tracking for user actions
- **Authentication** - User identity management
- **Performance** - Custom traces and screen monitoring
- **Remote Config** - Feature flags and configuration

### Theme Support

- Dark and light theme
- Automatic system preference detection
- Theme-aware components

## Navigation Structure

```
RootNavigator
├── Onboarding (if not completed)
│   ├── VehiclePreferencesScreen
│   └── CampyPlusScreen
└── Main App
    └── TabNavigator
        ├── Home (Map)
        ├── Trips
        ├── Favourites
        └── Profile
    └── Modals
        ├── LocationDetails
        └── CampyPlusModal
```

## State Management

### Auth Store (`authStore.ts`)

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}
```

### Favorites Store (`favoritesStore.ts`)

```typescript
interface FavoritesState {
  favorites: Location[];
  addFavorite: (location: Location) => void;
  removeFavorite: (uid: string) => void;
  isFavorite: (uid: string) => boolean;
  toggleFavorite: (location: Location) => void;
}
```

### Onboarding Store (`onboardingStore.ts`)

```typescript
interface OnboardingState {
  isOnboardingCompleted: boolean;
  vehicleType: VehicleType | null;
  setVehicleType: (type: VehicleType) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}
```

## GraphQL Integration

### Queries

```typescript
// Fetch nearby locations
FETCH_LOCATIONS_NEARBY(latitude, longitude, radiusKm)
```

### Mutations

```typescript
// User authentication
LOGIN_MUTATION(email, password)
```

See [graphql.md](../../graphql.md) for complete GraphQL documentation.

## Configuration

### App Configuration (`app.json`)

- **Bundle ID:** `app.campy.assignment`
- **iOS:** Firebase GoogleService-Info.plist, tablet support
- **Android:** Firebase google-services.json, edge-to-edge display
- **Plugins:** expo-splash-screen, expo-dev-client, expo-maps, Firebase

### Firebase Configuration

Place Firebase configuration files:
- iOS: `config/GoogleService-Info.plist`
- Android: `config/google-services.json`

### Environment Variables

```bash
# GraphQL API endpoint
EXPO_PUBLIC_GRAPHQL_URI=http://localhost:4000
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Start Expo development server |
| `pnpm ios` | Run on iOS simulator |
| `pnpm android` | Run on Android emulator |
| `pnpm web` | Run on web browser |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Run TypeScript type checking |

## Development

### Adding a New Screen

1. Create screen component in `screens/`
2. Add to navigation in `navigation/types.ts` and navigator
3. Add translations to `lang/*.json` files

### Adding a New Language

1. Create translation file in `lang/` (e.g., `pt.json`)
2. Add language to i18n configuration in `lib/i18n.ts`
3. Copy structure from `en.json` and translate

### Firebase Analytics Events

```typescript
import { Firebase } from '@/api/Firebase';

// Track custom event
Firebase.track('event_name', { param: 'value' });

// Track screen view
Firebase.trackScreenView('ScreenName', 'ScreenClass');
```

## Testing

```bash
# Type checking
pnpm check-types

# Linting
pnpm lint
```
