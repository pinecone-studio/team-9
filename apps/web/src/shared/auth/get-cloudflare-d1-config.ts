import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";

async function readFirstExistingFile(paths: string[]) {
  for (const relativePath of paths) {
    try {
      return await readFile(join(process.cwd(), relativePath), "utf8");
    } catch {
      continue;
    }
  }

  return null;
}

function readEnvValueFromFile(contents: string, key: string) {
  const line = contents
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${key}=`));

  if (!line) {
    return null;
  }

  return line.slice(key.length + 1).trim() || null;
}

export const getCloudflareD1Config = cache(async () => {
  const envFiles = await Promise.all([
    readFirstExistingFile([".env.local", "../.env.local", "../../.env.local"]),
    readFirstExistingFile([".env", "../.env", "../../.env"]),
  ]);
  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID?.trim() ??
    envFiles
      .map((contents) =>
        contents
          ? readEnvValueFromFile(contents, "CLOUDFLARE_ACCOUNT_ID")
          : null,
      )
      .find(Boolean) ??
    undefined;
  const apiToken =
    process.env.CLOUDFLARE_API_TOKEN?.trim() ??
    envFiles
      .map((contents) =>
        contents
          ? readEnvValueFromFile(contents, "CLOUDFLARE_API_TOKEN")
          : null,
      )
      .find(Boolean) ??
    undefined;
  let databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();

  if (!databaseId) {
    try {
      const wranglerConfig = await readFirstExistingFile([
        "apps/api/wrangler.jsonc",
        "../api/wrangler.jsonc",
        "../../apps/api/wrangler.jsonc",
      ]);

      if (!wranglerConfig) {
        throw new Error("wrangler.jsonc not found");
      }

      const parsed = JSON.parse(wranglerConfig) as {
        d1_databases?: Array<{
          database_id?: string;
        }>;
      };

      databaseId = parsed.d1_databases?.[0]?.database_id?.trim();
    } catch {
      databaseId = undefined;
    }
  }

  if (!accountId || !apiToken || !databaseId) {
    return null;
  }

  return {
    accountId,
    apiToken,
    databaseId,
  };
});
