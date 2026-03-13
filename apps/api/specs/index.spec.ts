import { SELF, createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('EBMS worker', () => {
	it('responds on the root route (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		expect(await response.text()).toBe('EBMS backend running');
	});

	it('responds on the root route (integration style)', async () => {
		const response = await SELF.fetch('https://example.com');

		expect(response.status).toBe(200);
		expect(await response.text()).toBe('EBMS backend running');
	});
});
