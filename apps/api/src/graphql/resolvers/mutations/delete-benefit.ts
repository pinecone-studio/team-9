import { eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefits } from "../../../db/schema/benefits";

export async function deleteBenefit(DB: D1Database, id: string): Promise<boolean> {
  const db = getDb({ DB });

  const [benefit] = await db
    .select({
      id: benefits.id,
      isActive: benefits.isActive,
    })
    .from(benefits)
    .where(eq(benefits.id, id))
    .limit(1);

  if (!benefit) {
    return false;
  }

  if (!benefit.isActive) {
    return true;
  }

  await db.update(benefits).set({ isActive: false }).where(eq(benefits.id, id));

  return true;
}
