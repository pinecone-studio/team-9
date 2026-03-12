import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_ENDPOINT!,
});

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}
