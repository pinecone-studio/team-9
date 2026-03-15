import type { Benefit, MutationCreateBenefitArgs } from "../../generated/resolvers-types";
import { applyCreateBenefit } from "./benefit-service";

export async function createBenefit(
  DB: D1Database,
  args: MutationCreateBenefitArgs,
): Promise<Benefit> {
  return applyCreateBenefit(DB, args.input);
}
