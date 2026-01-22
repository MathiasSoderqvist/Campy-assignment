# Campy

A multi-platform camping discovery and trip planning application with a React Native mobile app and GraphQL API.

## Overview

Campy helps users discover camping locations, plan trips, and manage their favorite spots. The app features an interactive map interface, user authentication, internationalization support, and Firebase integration for analytics and performance monitoring.

## Architecture

This project is organized as a **Turborepo monorepo** with the following structure:

```
campy-assignment/
├── apps/
│   ├── api/                    # GraphQL API server (Apollo Server)
│   └── mobile/                 # React Native mobile app (Expo)
├── packages/
│   ├── eslint-config/          # Shared ESLint configuration
│   └── typescript-config/      # Shared TypeScript configuration
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Tech Stack

### API
- **Apollo Server 4** - GraphQL server
- **GraphQL** - Query language
- **TypeScript** - Type safety

### Mobile App
- **React Native 0.81** - Cross-platform mobile framework
- **Expo 54** - Development platform
- **Apollo Client** - GraphQL client
- **React Navigation 7** - Navigation framework
- **Zustand** - State management with persistence
- **Firebase** - Analytics, Authentication, Performance, Remote Config
- **i18next** - Internationalization (6 languages)
- **expo-maps** - Native maps (Apple Maps on iOS, Google Maps on Android)

### Development Tools
- **Turborepo** - Monorepo build system
- **pnpm** - Package manager
- **TypeScript 5.9** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Prerequisites

- Node.js >= 18
- pnpm 9.0.0
- iOS development: Xcode, CocoaPods
- Android development: Android Studio, JDK

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd campy-assignment

# Install dependencies
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Or run specific apps
pnpm dev --filter=@campy/api      # GraphQL server on http://localhost:4000
pnpm dev --filter=mobile          # Expo development server
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=@campy/api
pnpm build --filter=mobile
```

### Linting & Type Checking

```bash
pnpm lint          # Run ESLint
pnpm check-types   # Run TypeScript type checking
pnpm format        # Format code with Prettier
```

## Apps

### API (`apps/api`)

GraphQL backend server providing:
- Location search with proximity filtering (Haversine distance)
- User authentication
- Mock data for 8 camping locations in the Amsterdam area

**Test Credentials:**
- Email: `test@campy.app`
- Password: `campy`

See [apps/api/README.md](apps/api/README.md) for detailed API documentation.

### Mobile (`apps/mobile`)

React Native mobile application featuring:
- Interactive map with camping locations
- User authentication with Firebase
- Favorites management with persistence
- Onboarding flow with vehicle selection
- Multi-language support (EN, NL, DE, IT, FR, ES)
- Dark/Light theme support
- Premium subscription screens (Campy Plus)

See [apps/mobile/README.md](apps/mobile/README.md) for detailed mobile documentation.

## Key Features

### Location Discovery
- Interactive map view with location markers
- Proximity-based search
- Detailed location information with ratings and reviews

### User Management
- Firebase Authentication integration
- Persistent login state
- User profile management

### Favorites
- Save favorite camping locations
- Persistent storage across sessions
- Quick access from dedicated screen

### Internationalization
- 6 languages: English, Dutch, German, Italian, French, Spanish
- Automatic device language detection
- In-app language switching

### Analytics & Monitoring
- Firebase Analytics event tracking
- Performance monitoring with custom traces
- Remote configuration support

## Project Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm check-types` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |

## GraphQL API

The API exposes the following operations:

### Queries
- `locationsNearby(latitude, longitude, radiusKm)` - Fetch nearby camping locations

### Mutations
- `login(email, password)` - Authenticate user and receive token

See [graphql.md](graphql.md) for complete schema documentation.

## License

Private - All rights reserved.
