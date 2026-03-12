const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../../../../..');
const ENV_FILE = path.join(ROOT, 'libs/tools/.env');
const APPS = new Set(['ebms-web', 'ebms-api']);

const parseEnvFile = () => {
  if (!fs.existsSync(ENV_FILE)) return {};

  return fs
    .readFileSync(ENV_FILE, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce((acc, line) => {
      const [key, ...rest] = line.split('=');
      acc[key] = rest.join('=');
      return acc;
    }, {});
};

const envFromFile = parseEnvFile();

const getEnv = (key) => {
  const value = process.env[key] ?? envFromFile[key] ?? '';
  return typeof value === 'string' ? value.trim() : '';
};

const runCommand = (command, { capture = false, env = {} } = {}) => {
  console.log(`\\n> ${command}\\n`);
  const commandEnv = { ...process.env, ...env };
  if (capture) {
    return execSync(command, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: commandEnv,
    }).toString();
  }

  execSync(command, { cwd: ROOT, stdio: 'inherit', env: commandEnv });
  return '';
};

const getNxBaseAndHead = () => {
  const base = getEnv('base') || getEnv('NX_BASE');
  const head = getEnv('head') || getEnv('NX_HEAD');
  return { base, head };
};

const getAffectedProjects = ({ target } = {}) => {
  const { base, head } = getNxBaseAndHead();

  let command = 'bunx nx show projects --affected --json';

  if (target) {
    command += ` --with-target=${target}`;
  }

  if (base && head) {
    command += ` --base=${base} --head=${head}`;
  }

  const raw = runCommand(command, { capture: true }).trim();
  if (!raw) return [];

  const parsed = JSON.parse(raw);
  return parsed.filter((project) => APPS.has(project));
};

const runTargetOnAffected = (target) => {
  const affected = getAffectedProjects({ target });
  if (affected.length === 0) {
    console.log(`No affected projects for target: ${target}`);
    return;
  }

  runCommand(`bunx nx run-many -t ${target} --projects=${affected.join(',')} --parallel=2`);
};

const normalizeName = (value, max = 58) => {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/^-+|-+$/g, '');

  if (!normalized) {
    throw new Error(`Could not normalize name from value: ${value}`);
  }

  return normalized;
};

const getPrContext = () => {
  const repository = getEnv('GITHUB_REPOSITORY');
  const [owner, repo] = repository.split('/');

  let number;
  const eventPath = getEnv('GITHUB_EVENT_PATH');
  if (eventPath && fs.existsSync(eventPath)) {
    const payload = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
    number = payload.pull_request?.number ?? payload.number;
  }

  return { owner, repo, number };
};

module.exports = {
  ROOT,
  getEnv,
  runCommand,
  getAffectedProjects,
  runTargetOnAffected,
  normalizeName,
  getPrContext,
};
