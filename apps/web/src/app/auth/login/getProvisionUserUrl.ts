const DEFAULT_GRAPHQL_ENDPOINT =
  "https://ebms-backend.b94889340.workers.dev/graphql";

export default function getProvisionUserUrl() {
  const graphqlEndpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? DEFAULT_GRAPHQL_ENDPOINT;
  const url = new URL(graphqlEndpoint);

  url.pathname = url.pathname.replace(/\/graphql\/?$/, "/auth/provision-user");

  if (!url.pathname.endsWith("/auth/provision-user")) {
    url.pathname = "/auth/provision-user";
  }

  return url.toString();
}
