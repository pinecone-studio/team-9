import type { DocumentNode } from "graphql";
import { print } from "graphql";

import { DEFAULT_GRAPHQL_ENDPOINT } from "./employee-dashboard.graphql";

type GraphqlResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
  }>;
};

function getGraphqlEndpoint() {
  return (
    process.env.GRAPHQL_ENDPOINT ??
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
    DEFAULT_GRAPHQL_ENDPOINT
  );
}

export async function postGraphql<T>(
  document: DocumentNode,
  variables: Record<string, unknown> = {},
) {
  const response = await fetch(getGraphqlEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to load employee dashboard data (${response.status}).`);
  }

  const payload = (await response.json()) as GraphqlResponse<T>;

  if (payload.errors?.length && !payload.data) {
    throw new Error(payload.errors[0]?.message ?? "GraphQL query failed.");
  }

  return payload.data;
}
