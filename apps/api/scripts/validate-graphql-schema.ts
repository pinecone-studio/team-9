import { createSchema } from 'graphql-yoga';

import { resolvers } from '../src/graphql/resolvers';
import { typeDefs } from '../src/graphql/schema';

try {
	createSchema({ typeDefs, resolvers });
	console.log('GraphQL schema validation passed.');
} catch (error) {
	console.error('GraphQL schema validation failed before deploy.');
	throw error;
}
