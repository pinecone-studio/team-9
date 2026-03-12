import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import { benefits } from '../../../db/schema/benefits';

export async function deleteBenefitCategory(DB: D1Database, id: string): Promise<boolean> {
	const db = getDb({ DB });

	const [category] = await db
		.select({ id: benefitCategories.id })
		.from(benefitCategories)
		.where(eq(benefitCategories.id, id))
		.limit(1);

	if (!category) {
		throw new Error(`Category not found: ${id}`);
	}

	const [linkedBenefit] = await db
		.select({ id: benefits.id })
		.from(benefits)
		.where(eq(benefits.categoryId, id))
		.limit(1);

	if (linkedBenefit) {
		throw new Error('Cannot delete a category that is used by benefits');
	}

	await db.delete(benefitCategories).where(eq(benefitCategories.id, id));

	return true;
}
