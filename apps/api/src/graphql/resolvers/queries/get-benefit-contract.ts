import { and, eq } from "drizzle-orm";

import { Env, getDb } from "../../../db";
import { benefits } from "../../../db/schema/benefits";
import { contracts } from "../../../db/schema/contracts";
import type { Contract } from "../../generated/resolvers-types";

async function findFallbackContract(
  env: Env,
  benefitId: string,
): Promise<typeof contracts.$inferSelect | null> {
  const db = getDb(env);
  const [contract] = await db
    .select()
    .from(contracts)
    .where(and(eq(contracts.benefitId, benefitId), eq(contracts.isActive, true)))
    .limit(1);

  return contract ?? null;
}

export async function findBenefitContractRecord(
  env: Env,
  benefitId: string,
): Promise<typeof contracts.$inferSelect | null> {
  const db = getDb(env);
  const [benefit] = await db
    .select({
      activeContractId: benefits.activeContractId,
      requiresContract: benefits.requiresContract,
    })
    .from(benefits)
    .where(eq(benefits.id, benefitId))
    .limit(1);

  if (!benefit) {
    throw new Error(`Benefit not found: ${benefitId}`);
  }

  if (!benefit.requiresContract) {
    return null;
  }

  if (benefit.activeContractId) {
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, benefit.activeContractId))
      .limit(1);

    if (contract) {
      return contract;
    }
  }

  return findFallbackContract(env, benefitId);
}

export async function getBenefitContract(
  env: Env,
  benefitId: string,
): Promise<Contract | null> {
  const contract = await findBenefitContractRecord(env, benefitId);

  if (!contract) {
    return null;
  }

  return {
    benefitId: contract.benefitId,
    effectiveDate: contract.effectiveDate,
    expiryDate: contract.expiryDate,
    id: contract.id,
    isActive: contract.isActive,
    r2ObjectKey: contract.r2ObjectKey,
    sha256Hash: contract.sha256Hash,
    vendorName: contract.vendorName,
    version: contract.version,
  };
}
