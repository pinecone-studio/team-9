import type { ApprovalRoleValue, SubmitBenefitUpdateRequestVariables } from "./edit-benefit-dialog.graphql";
import type { AssignedBenefitRule } from "./edit-benefit-dialog.types";

type ValidateBenefitSaveInputParams = {
  assignedRules: AssignedBenefitRule[];
  benefitDescription: string;
  contractFile: File | null;
  initialRequiresContract: boolean;
  isCore: boolean;
  name: string;
  requiresContract: boolean;
  subsidyPercentValue: string;
  vendorNameValue: string;
};

export type ValidatedBenefitSaveInput = {
  parsedSubsidy: number;
  trimmedDescription: string;
  trimmedName: string;
  trimmedVendorName: string;
};

export function isMissingIsActiveFieldError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  if (error instanceof Error) {
    const message = error.message ?? "";
    if (message.includes("UpdateBenefitInput") && message.includes("isActive")) {
      return true;
    }
  }

  if (typeof error === "object" && error !== null) {
    const graphQLErrors = (
      error as {
        graphQLErrors?: Array<{ message?: string }>;
      }
    ).graphQLErrors;

    if (Array.isArray(graphQLErrors)) {
      return graphQLErrors.some((item) => {
        const message = item?.message ?? "";
        return message.includes("UpdateBenefitInput") && message.includes("isActive");
      });
    }
  }

  return false;
}

export function validateBenefitSaveInput({
  assignedRules,
  benefitDescription,
  contractFile,
  initialRequiresContract,
  isCore,
  name,
  requiresContract,
  subsidyPercentValue,
  vendorNameValue,
}: ValidateBenefitSaveInputParams): { errorMessage: string } | ValidatedBenefitSaveInput {
  const trimmedName = name.trim();
  const trimmedDescription = benefitDescription.trim();
  const trimmedVendorName = vendorNameValue.trim();
  const parsedSubsidy = Number.parseInt(subsidyPercentValue, 10);

  if (!trimmedName) {
    return { errorMessage: "Benefit name is required." };
  }

  if (!trimmedDescription) {
    return { errorMessage: "Description is required." };
  }

  if (!Number.isInteger(parsedSubsidy) || parsedSubsidy < 0 || parsedSubsidy > 100) {
    return { errorMessage: "Subsidy percent must be a whole number between 0 and 100." };
  }

  if (requiresContract && !initialRequiresContract && !contractFile) {
    return { errorMessage: "Please upload a contract file." };
  }

  if (!isCore && assignedRules.length === 0) {
    return { errorMessage: "Please attach at least one eligibility rule or enable Core Benefit." };
  }

  return {
    parsedSubsidy,
    trimmedDescription,
    trimmedName,
    trimmedVendorName,
  };
}

type BuildBenefitInputParams = {
  approvalRole: ApprovalRoleValue;
  benefitId: string;
  categoryId: string;
  initialIsActive: boolean;
  isActive: boolean;
  isCore: boolean;
  parsedSubsidy: number;
  requiresContract: boolean;
  trimmedDescription: string;
  trimmedName: string;
  trimmedVendorName: string;
};

export function buildBenefitInput({
  approvalRole,
  benefitId,
  categoryId,
  initialIsActive,
  isActive,
  isCore,
  parsedSubsidy,
  requiresContract,
  trimmedDescription,
  trimmedName,
  trimmedVendorName,
}: BuildBenefitInputParams): SubmitBenefitUpdateRequestVariables["input"]["benefit"] {
  const benefitInput: SubmitBenefitUpdateRequestVariables["input"]["benefit"] = {
    id: benefitId,
    name: trimmedName,
    description: trimmedDescription,
    categoryId,
    subsidyPercent: parsedSubsidy,
    vendorName: trimmedVendorName || null,
    requiresContract,
    isCore,
    approvalRole,
  };

  if (isActive !== initialIsActive) {
    benefitInput.isActive = isActive;
  }

  return benefitInput;
}

export function buildRuleAssignments(
  assignedRules: AssignedBenefitRule[],
  isCore: boolean,
): SubmitBenefitUpdateRequestVariables["input"]["ruleAssignments"] {
  if (isCore) {
    return [];
  }

  return assignedRules.map((rule, index) => ({
    ruleId: rule.ruleId,
    operator: rule.operator,
    value: rule.value,
    errorMessage: rule.errorMessage,
    priority: index + 1,
    isActive: true,
  }));
}
