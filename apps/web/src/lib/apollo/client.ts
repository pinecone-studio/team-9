import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";

const LOCAL_HOSTNAMES = new Set(["127.0.0.1", "localhost"]);
const LOCAL_GRAPHQL_ENDPOINT = "http://localhost:8787/graphql";
const MISSING_ENDPOINT_ERROR =
  "Missing NEXT_PUBLIC_GRAPHQL_ENDPOINT for this deployment. Add it to the Cloudflare Pages environment variables and redeploy.";

function getConfiguredEndpoint() {
  const configuredEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  return configuredEndpoint ? configuredEndpoint : null;
}

function isLocalEnvironment() {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV !== "production";
  }

  return LOCAL_HOSTNAMES.has(window.location.hostname);
}

function createMissingEndpointLink() {
  return new ApolloLink(
    () =>
      new Observable((observer) => {
        observer.error(new Error(MISSING_ENDPOINT_ERROR));
      }),
  );
}

function createApolloLink() {
  const configuredEndpoint = getConfiguredEndpoint();

  if (configuredEndpoint) {
    return new HttpLink({ uri: configuredEndpoint });
  }

  if (isLocalEnvironment()) {
    return new HttpLink({ uri: LOCAL_GRAPHQL_ENDPOINT });
  }

  return createMissingEndpointLink();
}

export function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: createApolloLink(),
  });
}
