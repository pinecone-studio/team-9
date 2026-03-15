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

export type EditBenefitDialogState = {
  approvalRole: ApprovalRoleValue;
  benefitDescription: string;
  isCore: boolean;
  name: string;
  requiresContract: boolean;
  selectedRuleId: string;
  subsidyPercentValue: string;
  vendorNameValue: string;
};

export type RuleOption = AvailableRuleDefinition;
