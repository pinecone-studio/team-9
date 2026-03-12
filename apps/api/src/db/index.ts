import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema/index";

export type Env = {
  DB: D1Database;
  CONTRACTS_BUCKET: R2Bucket;
};

export type DbEnv = Pick<Env, "DB">;

export function getDb(env: DbEnv) {
  return drizzle(env.DB, { schema });
}
