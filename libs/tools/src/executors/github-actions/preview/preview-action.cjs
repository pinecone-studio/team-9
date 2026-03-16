const fs = require('node:fs');
const path = require('node:path');
const { getAffectedProjects, getEnv, getPrContext, normalizeName, runCommand } = require('../common.cjs');

const DEFAULT_GRAPHQL_ENDPOINT = 'https://ebms-backend.b94889340.workers.dev/graphql';
const API_WRANGLER_CONFIG = path.resolve(__dirname, '../../../../../../apps/api/wrangler.jsonc');
const PREVIEW_API_WRANGLER_CONFIG = path.resolve(
  __dirname,
  '../../../../../../apps/api/wrangler.preview.jsonc',
);
const WEB_WRANGLER_CONFIG = path.resolve(__dirname, '../../../../../../apps/web/wrangler.jsonc');
const PREVIEW_WEB_WRANGLER_CONFIG = path.resolve(
  __dirname,
  '../../../../../../apps/web/wrangler.preview.jsonc',
);
const PREVIEW_WORKER_NAME_MAX = 54;

const readWranglerName = (configPath) => {
  try {
    const source = fs.readFileSync(configPath, 'utf8');
    const match = source.match(/"name"\s*:\s*"([^"]+)"/);
    if (match?.[1]) {
      return normalizeName(match[1], 63);
    }
  } catch {
    // Fall back to hard-coded defaults.
  }

  return '';
};

const getDefaultWorkerName = () => {
  const explicitName = getEnv('CF_API_WORKER_NAME') || getEnv('CF_WORKER_NAME');
  if (explicitName) return normalizeName(explicitName, 63);

  const wranglerName = readWranglerName(API_WRANGLER_CONFIG);
  if (wranglerName) return wranglerName;

  return 'ebms-backend';
};

const getDefaultWebWorkerName = () => {
  const explicitName = getEnv('CF_WEB_WORKER_NAME') || getEnv('WEB_WORKER_NAME');
  if (explicitName) return normalizeName(explicitName, 63);

  const wranglerName = readWranglerName(WEB_WRANGLER_CONFIG);
  if (wranglerName) return wranglerName;

  const repository = getEnv('GITHUB_REPOSITORY').split('/')[1] || 'team-9';
  return normalizeName(`${repository}-web`, 63);
};

const resolveWorkersDevUrl = async (workerName) => {
  const token = getEnv('CLOUDFLARE_API_TOKEN');
  const accountId = getEnv('CLOUDFLARE_ACCOUNT_ID');
  if (!token || !accountId) return 'N/A';

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return 'N/A';

  const data = await response.json();
  const subdomain = data?.result?.subdomain;

  if (!subdomain) return 'N/A';
  return `https://${workerName}.${subdomain}.workers.dev`;
};

const extractWorkersDevUrl = (output, workerName) => {
  if (!output) return '';

  const matches = [...output.matchAll(/https:\/\/[^\s)]+\.workers\.dev/g)].map((match) => match[0]);
  if (matches.length === 0) return '';

  if (!workerName) return matches[0];

  const primaryUrl = matches.find((url) => url.includes(`https://${workerName}.`));
  const previewUrl = matches.find((url) => !url.includes(`https://${workerName}.`));
  return previewUrl || primaryUrl || matches[0];
};

const createPreviewWranglerConfig = ({ baseConfigPath, outputPath, workerName, vars }) => {
  const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, 'utf8'));
  const previewConfig = {
    ...baseConfig,
    name: workerName,
    vars,
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(previewConfig, null, 2)}\n`);
};

const createPreviewApiWranglerConfig = ({ workerName, vars }) => {
  createPreviewWranglerConfig({
    baseConfigPath: API_WRANGLER_CONFIG,
    outputPath: PREVIEW_API_WRANGLER_CONFIG,
    workerName,
    vars,
  });
  return 'apps/api/wrangler.preview.jsonc';
};

const createPreviewWebWranglerConfig = ({ workerName, vars }) => {
  createPreviewWranglerConfig({
    baseConfigPath: WEB_WRANGLER_CONFIG,
    outputPath: PREVIEW_WEB_WRANGLER_CONFIG,
    workerName,
    vars,
  });
  return 'wrangler.preview.jsonc';
};

const requireEnv = (name) => {
  const value = getEnv(name);
  if (!value) {
    throw new Error(
      `Missing required GitHub Actions secret/env: ${name}. Add it in GitHub repository Settings > Secrets and variables > Actions.`,
    );
  }

  return value;
};

const commentPreview = async ({ webAffected, apiAvailable, webUrl, apiUrl }) => {
  const token = getEnv('GITHUB_TOKEN');
  const { owner, repo, number } = getPrContext();
  if (!token || !owner || !repo || !number) return;

  const branch = getEnv('GITHUB_HEAD_REF') || getEnv('GITHUB_REF_NAME') || 'preview';
  const sha = (getEnv('GITHUB_SHA') || '').slice(0, 7);

  const body = [
    '## Preview Deployment',
    '',
    '| Target | URL |',
    '|---|---|',
    webAffected ? `| Web | [${webUrl}](${webUrl}) |` : '| Web | Skipped (not affected) |',
    apiAvailable ? `| API | [${apiUrl}](${apiUrl}) |` : '| API | Skipped (not affected) |',
    `| Branch | \`${branch}\` |`,
    `| Commit | \`${sha}\` |`,
  ].join('\n');

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to comment preview URLs: ${response.status} ${text}`);
  }
};

const main = async () => {
  const affected = getAffectedProjects();
  const webAffected = affected.includes('ebms-web');
  const apiAffected = affected.includes('ebms-api');

  if (!webAffected && !apiAffected) {
    console.log('No affected preview projects found.');
    return;
  }

  let webUrl = 'N/A';
  let apiUrl = 'N/A';

  const branch = getEnv('GITHUB_HEAD_REF') || getEnv('GITHUB_REF_NAME') || 'preview';
  const apiWorkerBaseName = getDefaultWorkerName();
  const apiWorkerName = normalizeName(`${apiWorkerBaseName}-${branch}`, PREVIEW_WORKER_NAME_MAX);
  const webWorkerBaseName = getDefaultWebWorkerName();
  const webWorkerName = normalizeName(`${webWorkerBaseName}-${branch}`, PREVIEW_WORKER_NAME_MAX);

  if (apiAffected || webAffected) {
    runCommand('bunx nx run ebms-api:codegen --skip-nx-cache');

    const clerkSecretKey = requireEnv('CLERK_SECRET_KEY');
    const apiPreviewConfig = createPreviewApiWranglerConfig({
      workerName: apiWorkerName,
      vars: {
        CLERK_SECRET_KEY: clerkSecretKey,
      },
    });

    try {
      const deployOutput = runCommand(
        `bunx wrangler deploy --config ${apiPreviewConfig}`,
        { capture: true },
      );
      process.stdout.write(deployOutput);
      apiUrl =
        extractWorkersDevUrl(deployOutput, apiWorkerName) ||
        (await resolveWorkersDevUrl(apiWorkerName));
    } finally {
      fs.rmSync(PREVIEW_API_WRANGLER_CONFIG, { force: true });
    }
  }

  if (webAffected) {
    const fallbackGraphqlEndpoint = getEnv('NEXT_PUBLIC_GRAPHQL_ENDPOINT') || DEFAULT_GRAPHQL_ENDPOINT;
    const graphqlEndpoint = apiUrl !== 'N/A' ? `${apiUrl}/graphql` : fallbackGraphqlEndpoint;
    const clerkPublishableKey = requireEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    const clerkSecretKey = requireEnv('CLERK_SECRET_KEY');
    const clerkEncryptionKey = getEnv('CLERK_ENCRYPTION_KEY') || clerkSecretKey;
    const previewWebEnv = {
      CLERK_ENCRYPTION_KEY: clerkEncryptionKey,
      CLERK_SECRET_KEY: clerkSecretKey,
      GRAPHQL_ENDPOINT: graphqlEndpoint,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkPublishableKey,
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: graphqlEndpoint,
    };

    runCommand('bunx nx run ebms-web:codegen --skip-nx-cache');
    const previewConfig = createPreviewWebWranglerConfig({
      workerName: webWorkerName,
      vars: previewWebEnv,
    });

    try {
      const deployOutput = runCommand(
        `bun run --cwd apps/web deploy -- --config=${previewConfig}`,
        {
          capture: true,
          env: previewWebEnv,
        },
      );
      process.stdout.write(deployOutput);

      webUrl =
        extractWorkersDevUrl(deployOutput, webWorkerName) ||
        (await resolveWorkersDevUrl(webWorkerName));
    } finally {
      fs.rmSync(PREVIEW_WEB_WRANGLER_CONFIG, { force: true });
    }
  }

  await commentPreview({ webAffected, apiAvailable: apiUrl !== 'N/A', webUrl, apiUrl });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
