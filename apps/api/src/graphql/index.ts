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

function getAllowedOrigins(env?: Env) {
  const configuredOrigins =
    env?.CORS_ORIGINS
      ?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  return [
    "https://studio.apollographql.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...configuredOrigins,
  ];
}

export default {
  async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
    const yoga = createYoga({
      schema,
      graphqlEndpoint: "/graphql",
      graphiql: true,
      cors: {
        origin: getAllowedOrigins(env),
        credentials: false,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "OPTIONS"],
      },
    });

    return yoga.fetch(request, { ...env, ...ctx });
  },
};
