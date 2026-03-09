## EBMS Monorepo

This repository contains both applications:

- `apps/dashboard`: Next.js frontend
- `apps/service`: Cloudflare Workers + Hono backend

## Install

```bash
npm install
```

## Local Development

Run the frontend:

```bash
npm run dev:dashboard
```

Run the backend:

```bash
npm run dev:service
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
- Backend production deployments use Cloudflare Workers.
