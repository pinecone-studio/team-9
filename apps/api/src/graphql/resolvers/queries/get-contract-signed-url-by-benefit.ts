import { GraphQLError } from "graphql";

import { Env } from "../../../db";
import { findBenefitContractRecord } from "./get-benefit-contract";

export async function getContractSignedUrlByBenefit(
  env: Env,
  benefitId: string,
): Promise<{ contractId: string; signedUrl: string; expiresAt: string }> {
  const contract = await findBenefitContractRecord(env, benefitId);

  if (!contract) {
    throw new GraphQLError("No contract is attached to this benefit yet.", {
      extensions: { code: "NOT_FOUND" },
    });
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
