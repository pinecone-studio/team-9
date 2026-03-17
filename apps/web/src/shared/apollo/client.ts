import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const DEFAULT_REMOTE_GRAPHQL_ENDPOINT =
  "https://ebms-backend.b94889340.workers.dev/graphql";
const DEFAULT_LOCAL_GRAPHQL_ENDPOINT = "http://127.0.0.1:8787/graphql";

function getDefaultGraphqlEndpoint() {
  if (process.env.NODE_ENV === "development") {
    return DEFAULT_LOCAL_GRAPHQL_ENDPOINT;
  }

  return DEFAULT_REMOTE_GRAPHQL_ENDPOINT;
}

const graphqlEndpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
  process.env.GRAPHQL_ENDPOINT ??
  getDefaultGraphqlEndpoint();

const httpLink = createHttpLink({
  uri: graphqlEndpoint,
});

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}
