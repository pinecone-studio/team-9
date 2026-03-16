import { and, eq } from "drizzle-orm";
import { GraphQLError } from "graphql";

import { Env, getDb } from "../../../db";
import { benefits } from "../../../db/schema/benefits";
import { contracts } from "../../../db/schema/contracts";

export async function getContractSignedUrlByBenefit(
  env: Env,
  benefitId: string,
): Promise<{ contractId: string; signedUrl: string; expiresAt: string }> {
  const db = getDb(env);

  const [activeContract] = await db
    .select()
    .from(contracts)
    .where(and(eq(contracts.benefitId, benefitId), eq(contracts.isActive, true)))
    .limit(1);

  let contract = activeContract;

  if (!contract) {
    const [benefit] = await db
      .select({
        activeContractId: benefits.activeContractId,
        requiresContract: benefits.requiresContract,
      })
      .from(benefits)
      .where(eq(benefits.id, benefitId))
      .limit(1);

    if (!benefit) {
      throw new GraphQLError(`Benefit not found: ${benefitId}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (!benefit.requiresContract) {
      throw new GraphQLError("This benefit does not require a contract.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    if (!benefit.activeContractId) {
      throw new GraphQLError("No contract is attached to this benefit yet.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const [contractById] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, benefit.activeContractId))
      .limit(1);

    if (!contractById) {
      throw new GraphQLError("Benefit contract metadata is missing.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    contract = contractById;
  }

  const object = await env.CONTRACTS_BUCKET.head(contract.r2ObjectKey);
  if (!object) {
    throw new GraphQLError("Contract file is unavailable in storage.", {
      extensions: { code: "NOT_FOUND" },
    });
  }
  const signedUrl = `/contracts/${contract.id}`;

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return { contractId: contract.id, signedUrl, expiresAt };
}
