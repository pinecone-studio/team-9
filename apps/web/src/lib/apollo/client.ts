import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

function resolveGraphqlEndpoint() {
  const configuredEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();

  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  return "http://localhost:8787/graphql";
}

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: resolveGraphqlEndpoint(),
    }),
  });
}
