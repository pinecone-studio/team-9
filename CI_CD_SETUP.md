# EBMS CI/CD Setup (TDD-aligned)

This repo now has separate CI and CD pipelines based on the TDD stack choice (`GitHub Actions + Wrangler CLI`).

## Workflows

- `.github/workflows/ci.yml`
  - Trigger: pull requests to `main`
  - Runs: `npm ci` -> `npm run lint` -> `npm run build`
  - Deploys PR preview to Cloudflare Pages
  - Comments preview URL back to the PR

- `.github/workflows/cd.yml`
  - Trigger: push to `main` (and manual `workflow_dispatch`)
  - Runs: `npm ci` -> `npm run lint` -> `npm run build`
  - Deploys production to Cloudflare Pages

## Required GitHub configuration

Set these before running workflows:

### Repository Secrets

- `CLOUDFLARE_API_TOKEN`
  - Cloudflare API token with Pages deploy permissions
- `CLOUDFLARE_ACCOUNT_ID`
  - Your Cloudflare account ID

### Repository Variables

- `CLOUDFLARE_PAGES_PROJECT_NAME`
  - Cloudflare Pages project name
- `PAGES_OUTPUT_DIR` (optional)
  - Default is `out` (Next.js static export)
  - Set this to your framework output path if you change build strategy later

## Important note for coding phase

This repository is now initialized with Next.js.
