import { readFileSync, writeFileSync } from "node:fs";

const generatedPath = new URL("../src/shared/apollo/generated.ts", import.meta.url);

const source = readFileSync(generatedPath, "utf8");

const withoutSuspenseHooks = source.replace(
  /\/\/ @ts-ignore[\s\S]*?export type [A-Za-z0-9_]+SuspenseQueryHookResult = ReturnType<typeof use[A-Za-z0-9_]+SuspenseQuery>;\n/g,
  "",
);

if (withoutSuspenseHooks !== source) {
  writeFileSync(generatedPath, withoutSuspenseHooks, "utf8");
}
