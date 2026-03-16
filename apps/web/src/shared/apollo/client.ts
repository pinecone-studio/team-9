import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const defaultGraphqlEndpoint =
  "https://ebms-backend.b94889340.workers.dev/graphql";
const graphqlEndpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
  process.env.GRAPHQL_ENDPOINT ??
  defaultGraphqlEndpoint;

const httpLink = createHttpLink({
  uri: graphqlEndpoint,
});

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}
