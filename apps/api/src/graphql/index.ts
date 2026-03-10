import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

type Env = {
  DB?: unknown;
  [key: string]: unknown;
};

type Ctx = {
  waitUntil?: (promise: Promise<unknown>) => void;
  passThroughOnException?: () => void;
};

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  graphiql: true,
  cors: {
    origin: ["https://studio.apollographql.com"],
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "OPTIONS"],
  },
});

export default {
  async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
    // Merge env and ctx into the Yoga context
    return yoga.fetch(request, { ...env, ...ctx });
  },
};
