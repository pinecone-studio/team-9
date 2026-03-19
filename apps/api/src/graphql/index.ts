import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

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
	graphqlEndpoint: '/graphql',
	graphiql: true,
	cors: {
		origin: ['*'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'authorization', 'clerk-Token'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	},
});

export default {
	async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
		return yoga.fetch(request, {
			...env,
			passThroughOnException: ctx.passThroughOnException?.bind(ctx),
			waitUntil: ctx.waitUntil?.bind(ctx),
		});
	},
};
