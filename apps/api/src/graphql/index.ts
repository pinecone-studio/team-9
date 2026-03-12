import { createSchema, createYoga } from 'graphql-yoga';
import type { Env } from '../db';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const schema = createSchema<Env>({ typeDefs, resolvers });

const yoga = createYoga<Env>({
	schema,
	graphqlEndpoint: '/graphql',
	graphiql: true,

	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
		allowedHeaders: ['*'],
	},
});

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		return yoga.fetch(request, env);
	},
};
