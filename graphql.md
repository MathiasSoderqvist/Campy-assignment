# GraphQL Setup Documentation

This document describes how GraphQL is configured and used in this project. Use this as a specification to set up a similar solution in other projects.

## Overview

This project uses **Apollo Client** for GraphQL operations with **GraphQL Code Generator** to automatically generate TypeScript types and React hooks from GraphQL queries and mutations.

## Architecture

```
┌─────────────────┐
│ graphql_queries │  ← Define queries/mutations with gql
│      .ts        │
└────────┬────────┘
         │
         │ codegen
         ▼
┌─────────────────┐
│   graphql.ts    │  ← Generated types & hooks
└────────┬────────┘
         │
         │ import
         ▼
┌─────────────────┐
│   Components    │  ← Use generated hooks
└─────────────────┘
```

## Dependencies

### Core Packages

```json
{
  "@apollo/client": "3.6.10",
  "graphql": "15.7.2",
  "graphql-tag": "^2.12.5"
}
```

### Code Generation (Dev Dependencies)

```json
{
  "@graphql-codegen/cli": "5.0.7",
  "@graphql-codegen/typescript": "^4.1.6",
  "@graphql-codegen/typescript-operations": "^4.6.1",
  "@graphql-codegen/typescript-react-apollo": "^4.3.3"
}
```

## Project Structure

```
src/
├── api/
│   ├── graphql.ts              # Generated types and hooks (DO NOT EDIT)
│   ├── graphql_queries.ts     # Define queries/mutations here
│   └── Firebase.ts            # Auth token provider
├── providers/
│   └── ApolloClientProvider.tsx  # Apollo Client setup
codegen.ts                      # Code generation config
```

## 1. Apollo Client Configuration

### Provider Setup (`src/providers/ApolloClientProvider.tsx`)

The Apollo Client is configured with:

- **InMemoryCache**: Caches query results
- **HttpLink**: Connects to GraphQL endpoint
- **Auth Link**: Adds Firebase ID token to requests
- **Error Link**: Handles token refresh on UNAUTHENTICATED errors
- **App Version Link**: Adds app version header
- **App Check Link**: Adds Firebase App Check token

```typescript
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      merge: true, // Merge User objects in cache
    },
  },
});

const httpLink = new HttpLink({
  uri: Constants.expoConfig?.extra?.graphqlUri,
});

// Error handling with automatic token refresh
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors?.[0]?.extensions?.code === "UNAUTHENTICATED") {
    // Refresh token and retry request
    return new Observable((observer) => {
      Firebase.refreshToken().then((refreshedToken) => {
        operation.setContext({
          headers: {
            ...operation.getContext().headers,
            authorization: `Bearer ${refreshedToken}`,
          },
        });
        return forward(operation).subscribe(observer);
      });
    });
  }
});

// Add auth token to requests
const authLink = setContext((_, { headers }) => {
  if (Firebase.idToken) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${Firebase.idToken}`,
      },
    };
  }
  return headers;
});

const client = new ApolloClient({
  link: from([appCheckLink, appVersionLink, authLink, errorLink, httpLink]),
  cache,
});

export default function ApolloClientProvider({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

### App Integration

Wrap your app with the provider:

```typescript
import ApolloClientProvider from "~/providers/ApolloClientProvider";

export default function App() {
  return (
    <ApolloClientProvider>
      {/* Your app */}
    </ApolloClientProvider>
  );
}
```

## 2. GraphQL Endpoint Configuration

### Environment Variables

The GraphQL URI is configured via Expo config:

**`app.config.js`**:
```javascript
extra: {
  graphqlUri: process.env.EXPO_PUBLIC_GRAPHQL_URI,
}
```

**`eas.json`** (for builds):
```json
{
  "env": {
    "EXPO_PUBLIC_GRAPHQL_URI": "https://your-graphql-server.com/"
  }
}
```

## 3. Code Generation Setup

### Configuration (`codegen.ts`)

```typescript
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://your-graphql-server.com/", // GraphQL schema endpoint
  documents: "src/api/graphql_queries.ts",     // Source file with queries
  generates: {
    "src/api/graphql.ts": {                    // Output file
      plugins: [
        "typescript",                          // Generate TypeScript types
        "typescript-operations",               // Generate operation types
        "typescript-react-apollo",             // Generate React hooks
      ],
      hooks: {
        afterOneFileWrite: [
          "prettier --write",                  // Format generated code
        ],
      },
    },
  },
};

export default config;
```

### NPM Script

Add to `package.json`:

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts"
  }
}
```

### Running Code Generation

```bash
npm run codegen
```

This will:
1. Fetch the GraphQL schema from the server
2. Parse queries/mutations from `graphql_queries.ts`
3. Generate TypeScript types and React hooks in `graphql.ts`

## 4. Defining Queries and Mutations

### File: `src/api/graphql_queries.ts`

Define all GraphQL operations using the `gql` template tag:

```typescript
import { gql } from "@apollo/client/core";

// Fragments (reusable query parts)
const LOCATION_FRAGMENT = gql`
  fragment LocationFragment on Location {
    uid
    title
    address
    latitude
    longitude
  }
`;

// Queries
export const FETCH_LOCATION = gql`
  ${LOCATION_FRAGMENT}
  query LocationFull($uid: String!, $language: String) {
    location: locationFull(uid: $uid, language: $language) {
      ...LocationFragment
    }
  }
`;

// Mutations
export const SAVE_LOCATION = gql`
  ${LOCATION_FRAGMENT}
  mutation SaveLocation($uid: ID, $location: LocationInput) {
    saveLocation(uid: $uid, location: $location) {
      ...LocationFragment
      action {
        type
        pointsGained
      }
    }
  }
`;
```

### Best Practices

1. **Use Fragments**: Reuse common field selections
2. **Export Queries/Mutations**: Export all operations for use in components
3. **Name Operations**: Always name queries/mutations for better debugging
4. **Type Variables**: Use proper GraphQL types (`String!`, `Int`, etc.)

## 5. Using Generated Hooks in Components

After running codegen, hooks are automatically generated:

### Query Hook

```typescript
import { useLocationFullQuery } from "~api";

function LocationScreen({ locationId }: { locationId: string }) {
  const { data, loading, error, refetch } = useLocationFullQuery({
    variables: { uid: locationId, language: "en" },
    fetchPolicy: "cache-and-network", // Optional
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <Text>{data?.location?.title}</Text>;
}
```

### Lazy Query Hook

For queries that should be triggered manually:

```typescript
import { useLocationFullLazyQuery } from "~api";

function LocationScreen() {
  const [fetchLocation, { data, loading }] = useLocationFullLazyQuery();

  const handleSearch = () => {
    fetchLocation({
      variables: { uid: "123", language: "en" },
    });
  };

  return <Button onPress={handleSearch} title="Load Location" />;
}
```

### Mutation Hook

```typescript
import { useSaveLocationMutation } from "~api";

function EditLocationScreen() {
  const [saveLocation, { loading, error }] = useSaveLocationMutation({
    refetchQueries: [
      { query: FETCH_LOCATION, variables: { uid: "123" } },
    ],
    onCompleted: (data) => {
      console.log("Location saved:", data);
    },
  });

  const handleSave = async () => {
    try {
      const result = await saveLocation({
        variables: {
          uid: "123",
          location: {
            title: "New Location",
            address: "123 Main St",
          },
        },
      });
      console.log("Saved:", result.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return <Button onPress={handleSave} disabled={loading} />;
}
```

### Generated Hook Naming Convention

- Query: `use<QueryName>Query` (e.g., `useLocationFullQuery`)
- Lazy Query: `use<QueryName>LazyQuery` (e.g., `useLocationFullLazyQuery`)
- Mutation: `use<MutationName>Mutation` (e.g., `useSaveLocationMutation`)

## 6. Authentication Flow

### Token Management

1. **Initial Request**: Auth link adds `Firebase.idToken` to headers
2. **Token Expiry**: Server returns `UNAUTHENTICATED` error
3. **Auto Refresh**: Error link calls `Firebase.refreshToken()`
4. **Retry**: Request is retried with new token

### Headers Added Automatically

- `Authorization: Bearer <firebase-id-token>`
- `app-version: <app-version>`
- `X-Firebase-AppCheck: <app-check-token>`

## 7. Cache Management

### Cache Policies

```typescript
// Use cache first, then network
fetchPolicy: "cache-first"

// Use network first, then cache
fetchPolicy: "network-only"

// Use cache and network (recommended for real-time data)
fetchPolicy: "cache-and-network"
```

### Refetching Queries

```typescript
// After mutation
refetchQueries: [
  { query: FETCH_LOCATION, variables: { uid: "123" } },
]

// Manual refetch
const { refetch } = useLocationFullQuery();
await refetch();
```

### Cache Updates

```typescript
const [saveLocation] = useSaveLocationMutation({
  update: (cache, { data }) => {
    // Manually update cache after mutation
    cache.writeQuery({
      query: FETCH_LOCATION,
      variables: { uid: data.saveLocation.uid },
      data: { location: data.saveLocation },
    });
  },
});
```

## 8. Error Handling

### GraphQL Errors

```typescript
const { data, error } = useLocationFullQuery();

if (error) {
  // Handle GraphQL errors
  error.graphQLErrors.forEach((err) => {
    console.error("GraphQL Error:", err.message);
  });
  
  // Handle network errors
  if (error.networkError) {
    console.error("Network Error:", error.networkError);
  }
}
```

### Mutation Errors

```typescript
const [saveLocation, { error }] = useSaveLocationMutation();

try {
  await saveLocation({ variables: { ... } });
} catch (err) {
  // Handle error
}
```

## 9. TypeScript Types

All types are automatically generated:

```typescript
import type { Location, LocationInput, SaveLocationMutation } from "~api";

// Use generated types
const location: Location = {
  uid: "123",
  title: "My Location",
  // ... other fields with full type safety
};
```

## 10. Development Workflow

1. **Define Query/Mutation** in `graphql_queries.ts`
2. **Run Codegen**: `npm run codegen`
3. **Import Hook** in component: `import { useXxxQuery } from "~api"`
4. **Use Hook** in component with full TypeScript support

## 11. Common Patterns

### Pagination

```typescript
export const FETCH_TRIPS = gql`
  query TripsForUser($uid: String!, $limit: Int, $cursor: String) {
    trips: tripsForUser(uid: $uid, limit: $limit, cursor: $cursor) {
      ...TripFragment
    }
  }
`;
```

### Conditional Queries

```typescript
const { data } = useLocationFullQuery({
  variables: { uid: locationId },
  skip: !locationId, // Skip if locationId is not available
});
```

### Optimistic Updates

```typescript
const [likeTrip] = useLikeTripMutation({
  optimisticResponse: {
    likeTrip: {
      __typename: "Trip",
      uid: tripId,
      // ... optimistic data
    },
  },
});
```

## 12. Testing

### Mock Apollo Client

```typescript
import { MockedProvider } from "@apollo/client/testing";

const mocks = [
  {
    request: {
      query: FETCH_LOCATION,
      variables: { uid: "123" },
    },
    result: {
      data: {
        location: { uid: "123", title: "Test Location" },
      },
    },
  },
];

<MockedProvider mocks={mocks}>
  <YourComponent />
</MockedProvider>
```

## Summary

This GraphQL setup provides:

✅ **Type Safety**: Full TypeScript support with generated types  
✅ **Developer Experience**: Auto-generated hooks for queries/mutations  
✅ **Authentication**: Automatic token management and refresh  
✅ **Error Handling**: Built-in error handling and retry logic  
✅ **Caching**: Efficient caching with Apollo Client  
✅ **Code Generation**: Single source of truth for queries and types  

To replicate this setup in another project:

1. Install dependencies
2. Configure Apollo Client provider
3. Set up code generation config
4. Define queries/mutations in `graphql_queries.ts`
5. Run codegen to generate types and hooks
6. Use generated hooks in components
