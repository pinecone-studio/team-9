import { eq, inArray } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefits } from "../../../db/schema/benefits";
import { contracts } from "../../../db/schema/contracts";
import type { Contract } from "../../generated/resolvers-types";

export async function listActiveBenefitContracts(
  DB: D1Database,
): Promise<Contract[]> {
  const db = getDb({ DB });
  const benefitRows = await db
    .select({
      activeContractId: benefits.activeContractId,
      benefitId: benefits.id,
    })
    .from(benefits)
    .where(eq(benefits.requiresContract, true));

  if (benefitRows.length === 0) {
    return [];
  }

  const activeContractIds = benefitRows
    .map((benefit) => benefit.activeContractId)
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  const [selectedContractRows, fallbackContractRows] = await Promise.all([
    activeContractIds.length > 0
      ? db.select().from(contracts).where(inArray(contracts.id, activeContractIds))
      : Promise.resolve([]),
    db.select().from(contracts).where(eq(contracts.isActive, true)),
  ]);

  const contractsById = new Map(selectedContractRows.map((contract) => [contract.id, contract]));
  const fallbackByBenefitId = new Map(
    fallbackContractRows.map((contract) => [contract.benefitId, contract]),
  );

  return benefitRows.flatMap((benefit) => {
    const contract =
      (benefit.activeContractId ? contractsById.get(benefit.activeContractId) : null) ??
      fallbackByBenefitId.get(benefit.benefitId) ??
      null;

    if (!contract) {
      return [];
    }

    return [
      {
        benefitId: contract.benefitId,
        effectiveDate: contract.effectiveDate,
        expiryDate: contract.expiryDate,
        id: contract.id,
        isActive: contract.isActive,
        r2ObjectKey: contract.r2ObjectKey,
        sha256Hash: contract.sha256Hash,
        vendorName: contract.vendorName,
        version: contract.version,
      },
    ];
  });
}
