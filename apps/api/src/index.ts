import { Hono } from 'hono';
import { cors } from 'hono/cors';
import yoga from './graphql';
import { getDb } from './db';
import { contracts } from './db/schema/contracts';
import { eq } from 'drizzle-orm';
import { getRealtimeHubStub } from './realtime/publish';

type Bindings = {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
	REALTIME_HUB: DurableObjectNamespace;
	CLERK_SECRET_KEY?: string;
	BREVO_API_KEY?: string;
	BREVO_FROM_EMAIL?: string;
	BREVO_FROM_NAME?: string;
};

const app = new Hono<{ Bindings: Bindings }>();
const authCors = cors({
	origin: '*',
	allowHeaders: ['Content-Type'],
	allowMethods: ['GET', 'POST', 'OPTIONS'],
});

app.use('/auth/*', authCors);
app.options('/auth/*', authCors);
app.use('/realtime/*', authCors);
app.options('/realtime/*', authCors);

app.get('/', () => {
	return new Response('EBMS backend running');
});

app.get('/contracts/:contractId', async (c) => {
	const contractId = c.req.param('contractId');
	const db = getDb({ DB: c.env.DB });

	const [contract] = await db
		.select({
			id: contracts.id,
			r2ObjectKey: contracts.r2ObjectKey,
		})
		.from(contracts)
		.where(eq(contracts.id, contractId))
		.limit(1);

	if (!contract) {
		return c.text('Contract not found.', 404);
	}

	const object = await c.env.CONTRACTS_BUCKET.get(contract.r2ObjectKey);
	if (!object) {
		return c.text('Contract file not found in storage.', 404);
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('etag', object.httpEtag);
	headers.set('Content-Disposition', 'inline');
	headers.set('Cache-Control', 'private, max-age=300');

	return new Response(object.body, {
		status: 200,
		headers,
	});
});

app.get('/realtime/events', async (c) => {
	const hub = getRealtimeHubStub(c.env);

	return hub.fetch('https://realtime.internal/stream');
});

app.all('/graphql', (c) => {
	return yoga.fetch(c.req.raw, c.env, c.executionCtx);
});

export { RealtimeHub } from './realtime/hub';
export default app;
