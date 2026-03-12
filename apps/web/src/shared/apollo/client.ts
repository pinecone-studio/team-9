import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const graphqlEndpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:8787/graphql";

const httpLink = createHttpLink({
  uri: graphqlEndpoint,
});

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}
