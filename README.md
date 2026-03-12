## EBMS Monorepo

This repository contains both applications:

- `apps/web`: Next.js frontend
- `apps/api`: Cloudflare Workers + Hono backend

## Install

```bash
npm install
```

## Local Development

Run the frontend:

```bash
npm run dev:web
```

Run the backend:

```bash
npm run dev:api
```

## Workspace Commands

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

## Deploy

- Frontend preview and production deployments use Cloudflare Pages.
- Backend preview and production deployments use Cloudflare Workers.

### Backend

Deploy the Worker:

```bash
npm run deploy:api
```

After deploy, note the public Worker URL. It will usually look like:

```text
https://ebms-backend.<your-subdomain>.workers.dev/graphql
```

If the frontend is deployed on a public domain, add that domain to `apps/api/wrangler.jsonc` in `vars.CORS_ORIGINS` before deploying the API. Wildcards are supported for preview URLs:

```text
http://localhost:3000,http://127.0.0.1:3000,https://your-pages-domain.pages.dev,https://*.your-pages-domain.pages.dev
```

### Frontend

Set the GraphQL endpoint at build time:

```bash
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://ebms-backend.<your-subdomain>.workers.dev/graphql
```

For local frontend development, you can copy `apps/web/.env.example` to `apps/web/.env.local` and update the value.

For Cloudflare Pages, add `NEXT_PUBLIC_GRAPHQL_ENDPOINT` in the Pages project environment variables, then redeploy the frontend.
