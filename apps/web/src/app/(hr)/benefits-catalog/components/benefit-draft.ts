export type BenefitDraft = {
  approvalRole: "finance_manager" | "hr_admin";
  categoryId: string;
  coreBenefitEnabled: boolean;
  description: string;
  name: string;
  requiresContract: boolean;
  subsidyPercent: number;
  vendorName: string;
};

type BuildDraftInput = {
  approvalRole: "finance_manager" | "hr_admin";
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
    approvalRole: input.approvalRole,
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
    draft.approvalRole !== "hr_admin" ||
    draft.coreBenefitEnabled ||
    draft.requiresContract ||
    draft.subsidyPercent !== 50 ||
    draft.categoryId !== ""
  );
}

export function areBenefitDraftsEqual(left: BenefitDraft, right: BenefitDraft) {
  return (
    left.approvalRole === right.approvalRole &&
    left.name === right.name &&
    left.description === right.description &&
    left.categoryId === right.categoryId &&
    left.subsidyPercent === right.subsidyPercent &&
    left.vendorName === right.vendorName &&
    left.coreBenefitEnabled === right.coreBenefitEnabled &&
    left.requiresContract === right.requiresContract
  );
}
