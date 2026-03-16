import type { Benefit, MutationUpdateBenefitArgs } from "../../generated/resolvers-types";
import { applyUpdateBenefit } from "./benefit-service";

export async function updateBenefit(
  DB: D1Database,
  args: MutationUpdateBenefitArgs,
): Promise<Benefit> {
  return applyUpdateBenefit(DB, args.input);
}
