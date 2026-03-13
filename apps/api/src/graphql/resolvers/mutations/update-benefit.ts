import { eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefitCategories } from "../../../db/schema/benefit-categories";
import { benefits } from "../../../db/schema/benefits";
import { mapBenefitRecord } from "../../../utils/mappers";
import type { Benefit, MutationUpdateBenefitArgs } from "../../generated/resolvers-types";

export async function updateBenefit(
  DB: D1Database,
  args: MutationUpdateBenefitArgs,
): Promise<Benefit> {
  const db = getDb({ DB });
  const id = args.input.id.trim();
  const name = args.input.name.trim();
  const categoryId = args.input.categoryId.trim();
  const subsidyPercent = args.input.subsidyPercent;
  const description = args.input.description.trim();
  const vendorName = args.input.vendorName?.trim() || null;

  if (!id) {
    throw new Error("Benefit id is required");
  }

  if (!name) {
    throw new Error("Benefit name is required");
  }

  if (!categoryId) {
    throw new Error("Category is required");
  }

  if (!description) {
    throw new Error("Description is required");
  }

  if (!Number.isInteger(subsidyPercent) || subsidyPercent < 0 || subsidyPercent > 100) {
    throw new Error("Subsidy percent must be an integer between 0 and 100");
  }

  const [existingBenefit] = await db
    .select({
      id: benefits.id,
      isActive: benefits.isActive,
      requiresContract: benefits.requiresContract,
    })
    .from(benefits)
    .where(eq(benefits.id, id))
    .limit(1);

  if (!existingBenefit) {
    throw new Error(`Benefit not found: ${id}`);
  }

  const [category] = await db
    .select({
      id: benefitCategories.id,
      name: benefitCategories.name,
    })
    .from(benefitCategories)
    .where(eq(benefitCategories.id, categoryId))
    .limit(1);

  if (!category) {
    throw new Error(`Category not found: ${categoryId}`);
  }

  await db
    .update(benefits)
    .set({
      name,
      description,
      categoryId,
      subsidyPercent,
      vendorName,
      requiresContract: args.input.requiresContract ?? existingBenefit.requiresContract,
    })
    .where(eq(benefits.id, id));

  return mapBenefitRecord({
    id,
    name,
    description,
    categoryId,
    category: category.name,
    is_active: existingBenefit.isActive,
    subsidy_percent: subsidyPercent,
    vendor_name: vendorName,
  });
}
