const fs = require('node:fs');
const path = require('node:path');
const { getAffectedProjects, getEnv, getPrContext, normalizeName, runCommand } = require('../common.cjs');
const DEFAULT_GRAPHQL_ENDPOINT = 'https://ebms-backend.b94889340.workers.dev/graphql';
const WEB_WRANGLER_CONFIG = path.resolve(__dirname, '../../../../../../apps/web/wrangler.jsonc');
const PREVIEW_WEB_WRANGLER_CONFIG = path.resolve(
  __dirname,
  '../../../../../../apps/web/wrangler.preview.jsonc',
);

const getDefaultWorkerName = () => {
  const explicitName = getEnv('CF_API_WORKER_NAME') || getEnv('CF_WORKER_NAME');
  if (explicitName) return normalizeName(explicitName, 63);

  return 'ebms-backend';
};

const getDefaultWebWorkerName = () => {
  const explicitName = getEnv('CF_WEB_WORKER_NAME') || getEnv('WEB_WORKER_NAME');
  if (explicitName) return normalizeName(explicitName, 63);

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

const createPreviewWebWranglerConfig = ({ workerName, vars }) => {
  const baseConfig = JSON.parse(fs.readFileSync(WEB_WRANGLER_CONFIG, 'utf8'));
  const previewConfig = {
    ...baseConfig,
    name: workerName,
    vars,
  };

  fs.writeFileSync(PREVIEW_WEB_WRANGLER_CONFIG, `${JSON.stringify(previewConfig, null, 2)}\n`);
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

  const apiWorkerName = getDefaultWorkerName();
  const webWorkerBaseName = getDefaultWebWorkerName();
  const branch = getEnv('GITHUB_HEAD_REF') || getEnv('GITHUB_REF_NAME') || 'preview';
  const webWorkerName = normalizeName(`${webWorkerBaseName}-${branch}`, 63);

  if (apiAffected) {
    const uploadOutput = runCommand(
      `bunx wrangler versions upload --config apps/api/wrangler.jsonc --name=${apiWorkerName}`,
      { capture: true },
    );
    process.stdout.write(uploadOutput);
    apiUrl =
      extractWorkersDevUrl(uploadOutput, apiWorkerName) ||
      (await resolveWorkersDevUrl(apiWorkerName));
  } else if (webAffected) {
    apiUrl = await resolveWorkersDevUrl(apiWorkerName);
  }

  if (webAffected) {
    const fallbackGraphqlEndpoint = getEnv('NEXT_PUBLIC_GRAPHQL_ENDPOINT') || DEFAULT_GRAPHQL_ENDPOINT;
    const graphqlEndpoint = apiUrl !== 'N/A' ? `${apiUrl}/graphql` : fallbackGraphqlEndpoint;
    const clerkPublishableKey = requireEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    const clerkSecretKey = requireEnv('CLERK_SECRET_KEY');
    const clerkEncryptionKey = getEnv('CLERK_ENCRYPTION_KEY') || clerkSecretKey;
    runCommand('bunx nx run ebms-web:codegen --skip-nx-cache');
    const previewConfig = createPreviewWebWranglerConfig({
      workerName: webWorkerName,
      vars: {
        CLERK_ENCRYPTION_KEY: clerkEncryptionKey,
        GRAPHQL_ENDPOINT: graphqlEndpoint,
        NEXT_PUBLIC_GRAPHQL_ENDPOINT: graphqlEndpoint,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkPublishableKey,
        CLERK_SECRET_KEY: clerkSecretKey,
      },
    });

    try {
      const deployOutput = runCommand(
        `bun run --cwd apps/web deploy -- --config=${previewConfig}`,
        { capture: true },
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
