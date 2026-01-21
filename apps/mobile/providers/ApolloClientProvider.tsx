import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from "@apollo/client/link/http";
import React from "react";

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
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
