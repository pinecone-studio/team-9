import type {
  ApprovalRoleValue,
  AvailableRuleDefinition,
} from "./edit-benefit-dialog.graphql";

export type AssignedBenefitRule = {
  defaultUnit?: string | null;
  errorMessage: string;
  id: string;
  name: string;
  operator: string;
  ruleId: string;
  value: string;
};

export type SpecificApproverOption = {
  email: string;
  id: string;
  label: string;
  role: ApprovalRoleValue;
};

export type EditBenefitDialogProps = {
  approvalRole: ApprovalRoleValue;
  benefitId: string;
  benefitName: string;
  category: string;
  categoryId: string;
  currentUserIdentifier: string;
  description: string;
  enabled: boolean;
  isCore: boolean;
  requiresContract: boolean;
  subsidyPercent: number;
  vendorName: string;
  onDeleted?: (benefitId: string) => void | Promise<unknown>;
  onSaved?: () => void | Promise<unknown>;
  onClose: () => void;
  onSubmitted?: (message: string) => void;
};

export type EditBenefitDialogState = {
  approvalRole: ApprovalRoleValue;
  benefitDescription: string;
  isCore: boolean;
  name: string;
  requiresContract: boolean;
  selectedRuleId: string;
  specificApproverId: string;
  subsidyPercentValue: string;
  vendorNameValue: string;
};

export type UseEditBenefitDialogActionsProps = {
  approvalRole: ApprovalRoleValue;
  assignedRules: AssignedBenefitRule[];
  benefitDescription: string;
  benefitId: string;
  benefitName: string;
  category: string;
  categoryId: string;
  contractFile: File | null;
  currentUserIdentifier: string;
  initialApprovalRole: ApprovalRoleValue;
  initialAssignedRules: AssignedBenefitRule[];
  initialBenefitDescription: string;
  initialIsActive: boolean;
  initialIsCore: boolean;
  initialRequiresContract: boolean;
  initialSubsidyPercent: number;
  initialVendorName: string;
  isActive: boolean;
  isCore: boolean;
  name: string;
  onClose: () => void;
  onSaved?: () => void | Promise<unknown>;
  onSubmitted?: (message: string) => void;
  requiresContract: boolean;
  subsidyPercentValue: string;
  vendorNameValue: string;
};

export type RuleOption = AvailableRuleDefinition;
