import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { Env, getDb } from "../../../db";
import { contracts } from "../../../db/schema/contracts";

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

  const object = await env.CONTRACTS_BUCKET.head(contract.r2ObjectKey);
  if (!object) {
    throw new GraphQLError("Contract file is unavailable in storage.", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  const signedUrl = `/contracts/${contract.id}`;

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return { contractId, signedUrl, expiresAt };
}
