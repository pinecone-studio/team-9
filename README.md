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

## Cloudflare R2 Setup (API)

1. Create a bucket:

```bash
npx wrangler r2 bucket create team9-assets
```

2. Ensure `apps/api/wrangler.jsonc` has this binding:

```jsonc
"r2_buckets": [
  {
    "binding": "ASSETS",
    "bucket_name": "team9-assets"
  }
]
```

3. Set URL signing secret (required for 7-day signed contract links):

```bash
cd apps/api
npx wrangler secret put R2_SIGNING_SECRET
```

4. Deploy API:

```bash
npm run deploy:api
```

## API Contract Endpoints (R2)

- `POST /contracts/upload` (`multipart/form-data`: `file`, `benefitId`, `version`)
- `GET /contracts/signed-url?key=contracts/{benefitId}/{version}/{filename}`
- `GET /contracts/object/{benefitId}/{version}/{filename}?exp={unix_ts}&sig={signature}`

Contract object key pattern:

- `contracts/{benefitId}/{version}/{filename}`
