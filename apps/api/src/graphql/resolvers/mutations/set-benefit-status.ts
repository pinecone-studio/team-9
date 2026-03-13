import { eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefitCategories } from "../../../db/schema/benefit-categories";
import { benefits } from "../../../db/schema/benefits";
import { mapBenefitRecord } from "../../../utils/mappers";
import type {
  Benefit,
  MutationSetBenefitStatusArgs,
} from "../../generated/resolvers-types";

export async function setBenefitStatus(
  DB: D1Database,
  args: MutationSetBenefitStatusArgs,
): Promise<Benefit> {
  const db = getDb({ DB });
  const id = args.input.id.trim();

  if (!id) {
    throw new Error("Benefit id is required");
  }

  await db
    .update(benefits)
    .set({ isActive: args.input.isActive })
    .where(eq(benefits.id, id));

  const [row] = await db
    .select({
      id: benefits.id,
      name: benefits.name,
      description: benefits.description,
      categoryId: benefits.categoryId,
      category: benefitCategories.name,
      is_active: benefits.isActive,
      subsidy_percent: benefits.subsidyPercent,
      vendor_name: benefits.vendorName,
    })
    .from(benefits)
    .leftJoin(benefitCategories, eq(benefitCategories.id, benefits.categoryId))
    .where(eq(benefits.id, id))
    .limit(1);

  if (!row) {
    throw new Error(`Benefit not found: ${id}`);
  }

  return mapBenefitRecord({
    id: row.id,
    name: row.name,
    description: row.description,
    categoryId: row.categoryId,
    category: row.category,
    is_active: row.is_active,
    subsidy_percent: row.subsidy_percent,
    vendor_name: row.vendor_name,
  });
}
