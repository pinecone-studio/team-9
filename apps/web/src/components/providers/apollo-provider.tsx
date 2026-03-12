"use client";

import { ApolloProvider } from "@apollo/client/react";
import { type PropsWithChildren } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function AppApolloProvider({ children }: PropsWithChildren) {
  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT!,
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
