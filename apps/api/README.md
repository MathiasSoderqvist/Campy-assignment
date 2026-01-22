# Campy API

GraphQL API server for the Campy camping location discovery app.

## Overview

The API provides location search and user authentication endpoints using Apollo Server with GraphQL.

## Tech Stack

- **Apollo Server 4** - GraphQL server framework
- **GraphQL** - Query language
- **TypeScript** - Type safety
- **tsx** - TypeScript execution

## Getting Started

### Installation

```bash
cd apps/api
pnpm install
```

### Development

```bash
pnpm dev
```

The server starts at `http://localhost:4000`.

### Build

```bash
pnpm build
```

### Production

```bash
pnpm start
```

## GraphQL Schema

### Types

#### Location

```graphql
type Location {
  uid: ID!
  title: String!
  address: String!
  latitude: Float!
  longitude: Float!
  description: String
  imageUrl: String
  rating: Float
  reviewCount: Int
}
```

#### User

```graphql
type User {
  uid: ID!
  email: String!
  displayName: String
}
```

#### AuthPayload

```graphql
type AuthPayload {
  token: String!
  user: User!
}
```

### Queries

#### `locationsNearby`

Fetch camping locations within a radius of a given coordinate.

```graphql
query LocationsNearby($latitude: Float!, $longitude: Float!, $radiusKm: Float) {
  locationsNearby(latitude: $latitude, longitude: $longitude, radiusKm: $radiusKm) {
    uid
    title
    address
    latitude
    longitude
    description
    imageUrl
    rating
    reviewCount
  }
}
```

**Parameters:**
- `latitude` (Float!, required) - Center point latitude
- `longitude` (Float!, required) - Center point longitude
- `radiusKm` (Float, optional) - Search radius in kilometers (default: 50)

**Example:**
```graphql
query {
  locationsNearby(latitude: 52.3676, longitude: 4.9041, radiusKm: 20) {
    uid
    title
    rating
  }
}
```

### Mutations

#### `login`

Authenticate a user with email and password.

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      uid
      email
      displayName
    }
  }
}
```

**Parameters:**
- `email` (String!, required) - User email address
- `password` (String!, required) - User password

**Returns:**
- `token` - JWT authentication token
- `user` - Authenticated user object

## Mock Data

The API includes mock data for development:

### Test Credentials

- **Email:** `test@campy.app`
- **Password:** `campy`

### Sample Locations

8 camping locations in the Amsterdam area:

| Location | Coordinates | Rating |
|----------|-------------|--------|
| Vondelpark Camping | 52.3579, 4.8686 | 4.5 |
| Amsterdam Forest Camp | 52.3089, 4.8367 | 4.7 |
| Waterland Campsite | 52.4321, 4.9876 | 4.3 |
| IJburg Beach Camp | 52.3545, 5.0123 | 4.1 |
| Haarlem Woods Retreat | 52.3456, 4.7234 | 4.6 |
| Zaanse Schans Camp | 52.4731, 4.8189 | 4.8 |
| Muiden Castle Grounds | 52.3342, 5.0678 | 4.4 |
| Aalsmeer Lake Camp | 52.2654, 4.7612 | 4.2 |

## Distance Calculation

Location filtering uses the Haversine formula to calculate great-circle distances between coordinates, providing accurate proximity search for locations within a specified radius.

## Project Structure

```
apps/api/
├── src/
│   ├── index.ts      # Apollo Server setup and entry point
│   ├── schema.ts     # GraphQL type definitions
│   └── resolvers.ts  # Query and mutation resolvers
├── dist/             # Compiled output
├── package.json
└── tsconfig.json
```

## API Playground

When running in development mode, visit `http://localhost:4000` to access the Apollo Server Sandbox for testing queries and mutations interactively.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run compiled server |
| `pnpm check-types` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |
