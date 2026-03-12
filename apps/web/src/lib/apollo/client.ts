import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const graphqlEndpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:8787/graphql";

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: graphqlEndpoint,
    }),
  });
}
