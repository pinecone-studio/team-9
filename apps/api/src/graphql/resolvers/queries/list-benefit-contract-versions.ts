import { desc, eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { contracts } from "../../../db/schema/contracts";
import type { Contract } from "../../generated/resolvers-types";

export async function listBenefitContractVersions(
  DB: D1Database,
  benefitId: string,
): Promise<Contract[]> {
  const db = getDb({ DB });
  const rows = await db
    .select()
    .from(contracts)
    .where(eq(contracts.benefitId, benefitId))
    .orderBy(desc(contracts.isActive), desc(contracts.effectiveDate), desc(contracts.version));

  return rows.map((contract) => ({
    benefitId: contract.benefitId,
    effectiveDate: contract.effectiveDate,
    expiryDate: contract.expiryDate,
    id: contract.id,
    isActive: contract.isActive,
    r2ObjectKey: contract.r2ObjectKey,
    sha256Hash: contract.sha256Hash,
    vendorName: contract.vendorName,
    version: contract.version,
  }));
}
