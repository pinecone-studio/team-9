import { Hono } from 'hono';
import { cors } from 'hono/cors';
import yoga from './graphql';

type Bindings = {
	DB: D1Database;
	CLERK_SECRET_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();
const authCors = cors({
	origin: '*',
	allowHeaders: ['Content-Type'],
	allowMethods: ['POST', 'OPTIONS'],
});

app.use('/auth/*', authCors);
app.options('/auth/*', authCors);

app.get('/', () => {
	return new Response('EBMS backend running');
});

app.all('/graphql', (c) => {
	return yoga.fetch(c.req.raw, c.env, c.executionCtx);
});

export default app;
