## EBMS Monorepo

This repository contains both applications:

- `apps/web`: Next.js frontend
- `apps/api`: Cloudflare Workers + Hono backend
- Nx workspace orchestration with Bun scripts

## Install

```bash
bun install
```

## Local Development

Run the frontend:

```bash
bun run dev:web
```

Run the backend:

```bash
bun run dev:api
```

## Workspace Commands

```bash
bun run lint
bun run type-check
bun run test
bun run build
```

## Deploy

- Frontend preview and production deployments use Cloudflare Pages.
- Backend preview and production deployments use Cloudflare Workers.
