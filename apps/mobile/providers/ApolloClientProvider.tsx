import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from "@apollo/client/link/http";
import React from "react";
import { Platform } from "react-native";

// On Android emulator, localhost refers to the emulator itself.
// Use 10.0.2.2 to reach the host machine.
// For physical devices, use your computer's local IP address.
const getApiUri = () => {
  const envUri = process.env.EXPO_PUBLIC_GRAPHQL_URI;
  if (envUri) return envUri;

  // Default fallback based on platform
  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000";
  }
  return "http://localhost:4000";
};

const httpLink = new HttpLink({
  uri: getApiUri(),
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

type Props = {
  children: React.ReactNode;
};

export function ApolloClientProvider({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
