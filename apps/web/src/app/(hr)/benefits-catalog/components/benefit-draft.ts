export type BenefitDraft = {
  categoryId: string;
  coreBenefitEnabled: boolean;
  description: string;
  name: string;
  requiresContract: boolean;
  subsidyPercent: number;
  vendorName: string;
};

type BuildDraftInput = {
  categoryId: string;
  coreBenefitEnabled: boolean;
  description: string;
  name: string;
  requiresContract: boolean;
  subsidyPercent: string;
  vendorName: string;
};

export function buildBenefitDraft(input: BuildDraftInput): BenefitDraft {
  const parsedSubsidy = Number.parseInt(input.subsidyPercent, 10);

  return {
    name: input.name,
    description: input.description,
    categoryId: input.categoryId,
    subsidyPercent: Number.isInteger(parsedSubsidy) ? parsedSubsidy : 50,
    vendorName: input.vendorName,
    coreBenefitEnabled: input.coreBenefitEnabled,
    requiresContract: input.requiresContract,
  };
}

export function hasBenefitDraftContent(draft: BenefitDraft) {
  return (
    draft.name.trim().length > 0 ||
    draft.description.trim().length > 0 ||
    draft.vendorName.trim().length > 0 ||
    draft.coreBenefitEnabled ||
    draft.requiresContract ||
    draft.subsidyPercent !== 50 ||
    draft.categoryId !== ""
  );
}
