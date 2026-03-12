import { eq } from "drizzle-orm";
import { Env, getDb } from "../../../db";
import { contracts } from "../../../db/schema/contracts";
import { getSignedDownloadUrl } from "../../../lib/r2";

export async function getContractSignedUrl(
  env: Env,
  contractId: string,
): Promise<{ contractId: string; signedUrl: string; expiresAt: string }> {
  const db = getDb(env);

  const [contract] = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, contractId))
    .limit(1);

  if (!contract) {
    throw new Error(`Contract not found: ${contractId}`);
  }

  const signedUrl = await getSignedDownloadUrl(env.CONTRACTS_BUCKET, contract.r2ObjectKey);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return { contractId, signedUrl, expiresAt };
}