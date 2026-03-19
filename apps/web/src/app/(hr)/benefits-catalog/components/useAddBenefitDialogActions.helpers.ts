import type { ApprovalRoleValue } from "./add-benefit-dialog.graphql";
import {
  isEditableDateComplete,
  toIsoEditableDate,
} from "./contract-upload-client";
import type { BenefitDraft } from "./benefit-draft";
import type { AssignedBenefitRule } from "./edit-benefit-dialog.types";

export type UseAddBenefitDialogActionsProps = {
  approvalRole: ApprovalRoleValue;
  assignedRules: AssignedBenefitRule[];
  categoryId: string;
  contractEffectiveDate: string;
  contractExpiryDate: string;
  contractFile: File | null;
  coreBenefitEnabled: boolean;
  currentUserIdentifier: string;
  description: string;
  initialDraft?: BenefitDraft | null;
  name: string;
  onClose: () => void;
  onCreated?: () => void | Promise<unknown>;
  onDraftChange?: (draft: BenefitDraft | null) => void;
  onSubmitted?: (message: string) => void;
  requiresContract: boolean;
  subsidyPercent: string;
  vendorName: string;
};

type AddBenefitSaveValidationInput = Pick<
  UseAddBenefitDialogActionsProps,
  | "categoryId"
  | "contractEffectiveDate"
  | "contractExpiryDate"
  | "contractFile"
  | "description"
  | "name"
  | "requiresContract"
  | "subsidyPercent"
  | "vendorName"
>;

type AddBenefitSaveValidationResult =
  | { errorMessage: string }
  | {
      parsedSubsidy: number;
      trimmedDescription: string;
      trimmedName: string;
      trimmedVendorName: string;
    };

export function validateAddBenefitSaveInput({
  categoryId,
  contractEffectiveDate,
  contractExpiryDate,
  contractFile,
  description,
  name,
  requiresContract,
  subsidyPercent,
  vendorName,
}: AddBenefitSaveValidationInput): AddBenefitSaveValidationResult {
  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const trimmedVendorName = vendorName.trim();
  const parsedSubsidy = Number.parseInt(subsidyPercent, 10);

  if (!trimmedName) return { errorMessage: "Benefit name is required." };
  if (!categoryId) return { errorMessage: "Category is missing. Please add from a category section." };
  if (!trimmedDescription) return { errorMessage: "Description is required." };
  if (requiresContract && !trimmedVendorName) return { errorMessage: "Vendor name is required when contract is enabled." };
  if (!Number.isInteger(parsedSubsidy) || parsedSubsidy < 0 || parsedSubsidy > 100) {
    return { errorMessage: "Subsidy percent must be a whole number between 0 and 100." };
  }
  if (requiresContract && !contractFile) return { errorMessage: "Please upload a contract file." };
  if (requiresContract && !contractEffectiveDate.trim()) return { errorMessage: "Effective date is required when contract is enabled." };
  if (requiresContract && !contractExpiryDate.trim()) return { errorMessage: "Expiry date is required when contract is enabled." };
  if (requiresContract && (!isEditableDateComplete(contractEffectiveDate) || !isEditableDateComplete(contractExpiryDate))) {
    return { errorMessage: "Contract dates must use the yyyy.mm.dd format." };
  }
  if (requiresContract && toIsoEditableDate(contractExpiryDate) < toIsoEditableDate(contractEffectiveDate)) {
    return { errorMessage: "Expiry date must be on or after the effective date." };
  }

  return {
    parsedSubsidy,
    trimmedDescription,
    trimmedName,
    trimmedVendorName,
  };
}
