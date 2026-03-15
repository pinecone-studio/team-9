const { getAffectedProjects, getEnv, getPrContext, normalizeName, runCommand } = require('../common.cjs');
const fs = require('node:fs');
const path = require('node:path');

const getDefaultWorkerName = () => {
  const explicitName = getEnv('CF_API_WORKER_NAME') || getEnv('CF_WORKER_NAME');
  if (explicitName) return normalizeName(explicitName, 63);

  try {
    const wranglerPath = path.resolve(__dirname, '../../../../../../apps/api/wrangler.jsonc');
    const source = fs.readFileSync(wranglerPath, 'utf8');
    const match = source.match(/"name"\s*:\s*"([^"]+)"/);
    if (match?.[1]) return normalizeName(match[1], 63);
  } catch {
    // Fallback below
  }

  return 'ebms-backend';
};

const ensurePagesProject = async (projectName) => {
  const token = getEnv('CLOUDFLARE_API_TOKEN');
  const accountId = getEnv('CLOUDFLARE_ACCOUNT_ID');
  if (!token || !accountId) {
    throw new Error('CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required for preview deployment');
  }

  const apiBase = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`;
  const compatDate = new Date().toISOString().slice(0, 10);

  const checkResponse = await fetch(`${apiBase}/${projectName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (checkResponse.ok) {
    const checkJson = await checkResponse.json();
    if (checkJson.success) return;
  }

  const createResponse = await fetch(apiBase, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: projectName,
      production_branch: 'main',
      deployment_configs: {
        preview: {
          compatibility_date: compatDate,
          compatibility_flags: ['nodejs_compat'],
        },
        production: {
          compatibility_date: compatDate,
          compatibility_flags: ['nodejs_compat'],
        },
      },
    }),
  });

  const createJson = await createResponse.json();
  if (!createResponse.ok || !createJson.success) {
    throw new Error(`Failed to create Cloudflare Pages project: ${JSON.stringify(createJson)}`);
  }
};

const resolveApiPreviewUrl = async (workerName) => {
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

const extractPagesPreviewUrl = (output, projectName) => {
  if (!output) return '';

  const matches = [...output.matchAll(/https:\/\/[^\s)]+\.pages\.dev/g)].map((match) => match[0]);
  if (matches.length === 0) return '';

  const defaultProjectUrl = `https://${projectName}.pages.dev`;
  const previewUrl = matches.find((url) => url !== defaultProjectUrl);

  return previewUrl || matches[0];
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

  const workerName = getDefaultWorkerName();

  if (apiAffected) {
    runCommand('bunx nx run ebms-api:codegen --skip-nx-cache');
    const uploadOutput = runCommand(
      `bunx wrangler versions upload --config apps/api/wrangler.jsonc --name=${workerName}`,
      { capture: true },
    );
    process.stdout.write(uploadOutput);
    apiUrl = extractWorkersDevUrl(uploadOutput, workerName) || (await resolveApiPreviewUrl(workerName));
  } else if (webAffected) {
    apiUrl = await resolveApiPreviewUrl(workerName);
  }

  if (webAffected) {
    const fallbackGraphqlEndpoint = getEnv('NEXT_PUBLIC_GRAPHQL_ENDPOINT') || 'http://localhost:8787/graphql';
    const graphqlEndpoint = apiUrl !== 'N/A' ? `${apiUrl}/graphql` : fallbackGraphqlEndpoint;
    runCommand('bunx nx run ebms-web:build-pages --skip-nx-cache', {
      env: {
        NEXT_PUBLIC_GRAPHQL_ENDPOINT: graphqlEndpoint,
      },
    });

    const rawProjectName = getEnv('CF_PAGES_PROJECT_NAME') || getEnv('GITHUB_REPOSITORY').split('/')[1] || 'team-9';
    const projectName = normalizeName(rawProjectName);
    await ensurePagesProject(projectName);

    const branch = getEnv('GITHUB_HEAD_REF') || getEnv('GITHUB_REF_NAME') || 'preview';
    const deployOutput = runCommand(
      `bunx wrangler pages deploy apps/web/out --project-name=${projectName} --branch=${branch} --commit-dirty=true`,
      { capture: true },
    );
    process.stdout.write(deployOutput);

    webUrl = extractPagesPreviewUrl(deployOutput, projectName) || `https://${projectName}.pages.dev`;
  }

  await commentPreview({ webAffected, apiAvailable: apiUrl !== 'N/A', webUrl, apiUrl });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
