"use client";

import { ApolloProvider } from "@apollo/client/react";
import { type PropsWithChildren } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function AppApolloProvider({ children }: PropsWithChildren) {
  const graphqlEndpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || process.env.GRAPHQL_ENDPOINT;

  const httpLink = new HttpLink({
    uri: graphqlEndpoint,
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
