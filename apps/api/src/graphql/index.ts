import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

type Env = {
  CORS_ORIGINS?: string;
  DB?: unknown;
  [key: string]: unknown;
};

type Ctx = {
  waitUntil?: (promise: Promise<unknown>) => void;
  passThroughOnException?: () => void;
};

const schema = createSchema({ typeDefs, resolvers });
const ALLOWED_HEADERS = "Content-Type, Authorization";
const ALLOWED_METHODS = "GET, POST, OPTIONS";

function getAllowedOrigins(env?: Env) {
  const configuredOrigins =
    env?.CORS_ORIGINS
      ?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  return new Set([
    "https://studio.apollographql.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...configuredOrigins,
  ]);
}

function getCorsHeaders(request: Request, env?: Env) {
  const requestOrigin = request.headers.get("origin");
  const headers = new Headers({
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    Vary: "Origin",
  });

  if (requestOrigin && getAllowedOrigins(env).has(requestOrigin)) {
    headers.set("Access-Control-Allow-Origin", requestOrigin);
  }

  return headers;
}

export default {
  async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
    const yoga = createYoga({
      schema,
      graphqlEndpoint: "/graphql",
      graphiql: true,
      cors: false,
    });

    const corsHeaders = getCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      const status = corsHeaders.has("Access-Control-Allow-Origin") ? 204 : 403;

      return new Response(null, {
        headers: corsHeaders,
        status,
      });
    }

    const response = await yoga.fetch(request, { ...env, ...ctx });
    const responseHeaders = new Headers(response.headers);

    corsHeaders.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new Response(response.body, {
      headers: responseHeaders,
      status: response.status,
      statusText: response.statusText,
    });
  },
};
