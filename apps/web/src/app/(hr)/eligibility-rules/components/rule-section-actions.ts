import {
  ApprovalActionType,
  ApprovalEntityType,
  ApprovalRole,
  RuleValueType,
} from "@/shared/apollo/generated";
import type {
  CreateRuleApprovalRequestMutationHookResult,
  DeleteRuleApprovalRequestMutationHookResult,
  Operator,
  RuleType,
  UpdateRuleApprovalRequestMutationHookResult,
} from "@/shared/apollo/generated";
import type { ApprovalRoleValue } from "./RuleApprovalSection";
import type { RuleCardModel } from "../types";
import {
  getAllowedOperators,
  getFallbackCategoryId,
} from "./rule-section-list.utils";
import {
  buildRuleDeletePayload,
  buildRuleDeleteSnapshot,
} from "./rule-delete-request-payload";

type AddRuleInput = {
  approvalRole: ApprovalRoleValue;
  defaultOperator: Operator;
  defaultUnit?: string;
  description: string;
  name: string;
  optionsJson?: string;
  ruleType: RuleType;
  value: string;
  valueType: RuleValueType;
};

type SaveRuleInput = {
  approvalRole: ApprovalRoleValue;
  description: string;
  id: string;
  measurement?: string;
  name: string;
  optionsJson?: string;
  ruleType?: RuleType;
  value?: string;
  valueType?: RuleValueType;
};

type DeleteRuleInput = {
  approvalRole: ApprovalRoleValue;
  deleteComment: string;
  id: string;
};

export async function submitAddRuleRequest(params: {
  activeSection: string;
  categoryNameToId: Map<string, string>;
  createRuleApprovalRequest: CreateRuleApprovalRequestMutationHookResult[0];
  currentUserIdentifier: string;
  input: AddRuleInput;
}) {
  const { activeSection, categoryNameToId, createRuleApprovalRequest, currentUserIdentifier, input } = params;
  const ruleInput = {
    allowedOperators: getAllowedOperators(input.valueType),
    categoryId:
      categoryNameToId.get(activeSection) ?? getFallbackCategoryId(activeSection),
    defaultOperator: input.defaultOperator,
    defaultUnit: input.defaultUnit,
    defaultValue:
      input.valueType === RuleValueType.Number ||
      input.valueType === RuleValueType.Date
        ? JSON.stringify(Number(input.value))
        : input.valueType === RuleValueType.Boolean
          ? JSON.stringify(input.value.toLowerCase() === "true")
          : JSON.stringify(input.value),
    description: input.description,
    isActive: true,
    name: input.name,
    optionsJson: input.optionsJson,
    ruleType: input.ruleType,
    valueType: input.valueType,
  };

  const result = await createRuleApprovalRequest({
    variables: {
      input: {
        actionType: ApprovalActionType.Create,
        entityType: ApprovalEntityType.Rule,
        payloadJson: JSON.stringify({ rule: ruleInput }),
        requestedBy: currentUserIdentifier,
        targetRole: input.approvalRole,
      },
    },
  });
  if (!result.data?.createApprovalRequest.id) {
    throw new Error("Failed to submit rule request");
  }
}

export async function submitUpdateRuleRequest(params: {
  currentUserIdentifier: string;
  editingRule: RuleCardModel;
  input: SaveRuleInput;
  updateRuleApprovalRequest: UpdateRuleApprovalRequestMutationHookResult[0];
}) {
  const { currentUserIdentifier, editingRule, input, updateRuleApprovalRequest } =
    params;
  const ruleInput = {
    description: input.description,
    defaultUnit: input.measurement,
    defaultValue: input.value,
    id: editingRule.id,
    name: input.name,
    optionsJson: input.optionsJson,
    ruleType: input.ruleType,
    valueType: input.valueType,
  };

  await updateRuleApprovalRequest({
    variables: {
      input: {
        actionType: ApprovalActionType.Update,
        entityId: editingRule.id,
        entityType: ApprovalEntityType.Rule,
        payloadJson: JSON.stringify({ rule: ruleInput }),
        requestedBy: currentUserIdentifier,
        snapshotJson: JSON.stringify(editingRule),
        targetRole: input.approvalRole,
      },
    },
  });
}

export async function submitDeleteRuleRequest(params: {
  currentUserIdentifier: string;
  deleteRuleApprovalRequest: DeleteRuleApprovalRequestMutationHookResult[0];
  editingRule: RuleCardModel | null;
  input: DeleteRuleInput;
}) {
  const { currentUserIdentifier, deleteRuleApprovalRequest, editingRule, input } =
    params;
  const { approvalRole, deleteComment, id } = input;

  const result = await deleteRuleApprovalRequest({
    variables: {
      input: {
        actionType: ApprovalActionType.Delete as ApprovalActionType,
        entityId: id,
        entityType: ApprovalEntityType.Rule,
        payloadJson: JSON.stringify(buildRuleDeletePayload(editingRule, id)),
        requestedBy: currentUserIdentifier,
        snapshotJson: JSON.stringify(
          buildRuleDeleteSnapshot(editingRule, deleteComment, id),
        ),
        targetRole: approvalRole ?? ApprovalRole.HrAdmin,
      },
    },
  });
  if (!result.data?.createApprovalRequest.id) {
    throw new Error("Failed to submit delete request");
  }

  return true;
}
