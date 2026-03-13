import { Hono } from 'hono';
import yoga from './graphql';

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.all('/graphql', (c) => {
	return yoga.fetch(c.req.raw, c.env, c.executionCtx);
});

export default app;
