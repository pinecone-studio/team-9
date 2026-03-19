"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

import EditBenefitDialogFooter from "./EditBenefitDialogFooter";
import EditBenefitDialogForm from "./EditBenefitDialogForm";
import {
  buildSpecificApproverOptions,
  findSpecificApprover,
} from "./edit-benefit-dialog.approvers";
import {
  BENEFIT_EDIT_RULES_QUERY,
  type ApprovalRoleValue,
  type BenefitEditRulesQuery,
  type BenefitEditRulesVariables,
} from "./edit-benefit-dialog.graphql";
import { mapInitialAssignedRules } from "./edit-benefit-dialog.rules";
import type { EditBenefitDialogProps } from "./edit-benefit-dialog.types";
import { useBenefitRuleAssignments } from "./useBenefitRuleAssignments";
import { useEditBenefitDialogActions } from "./useEditBenefitDialogActions";

export default function EditBenefitDialog({
  approvalRole: initialApprovalRole,
  benefitId,
  benefitName,
  category,
  categoryId,
  currentUserIdentifier,
  description,
  enabled: initialIsActive,
  isCore: initialIsCore,
  requiresContract: initialRequiresContract,
  subsidyPercent,
  vendorName,
  onSaved,
  onClose,
  onSubmitted,
}: EditBenefitDialogProps) {
  const [name, setName] = useState(benefitName);
  const [benefitDescription, setBenefitDescription] = useState(description);
  const [specificApproverId, setSpecificApproverId] = useState("");
  const [archiveComment, setArchiveComment] = useState("");
  const [archiveMode, setArchiveMode] = useState(false);
  const [subsidyPercentValue, setSubsidyPercentValue] = useState(String(subsidyPercent));
  const [vendorNameValue, setVendorNameValue] = useState(vendorName);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [approvalRole, setApprovalRole] = useState<ApprovalRoleValue>(initialApprovalRole);
  const [isCore, setIsCore] = useState(initialIsCore);
  const [requiresContract, setRequiresContract] = useState(initialRequiresContract);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data } = useQuery<BenefitEditRulesQuery, BenefitEditRulesVariables>(BENEFIT_EDIT_RULES_QUERY, {
    variables: { benefitId },
  });
  const specificApproverOptions = useMemo(
    () => buildSpecificApproverOptions(data?.employees),
    [data?.employees],
  );
  const selectedApprover = findSpecificApprover(specificApproverOptions, specificApproverId);
  const resolvedApprovalRole = selectedApprover?.role ?? approvalRole;
  const resolvedSpecificApproverId = selectedApprover?.id ?? "";

  const {
    assignedRules,
    availableRules,
    handleAddRule,
    handleDeleteRule,
    selectedRuleId,
    setSelectedRuleId,
  } = useBenefitRuleAssignments({
    initialRules: data?.eligibilityRules,
    ruleDefinitions: data?.ruleDefinitions,
  });
  const initialAssignedRules = mapInitialAssignedRules(data?.eligibilityRules);
  const { deleting, handleDelete, handleSave, updating } = useEditBenefitDialogActions({
    approvalRole: resolvedApprovalRole,
    assignedRules,
    benefitDescription,
    benefitId,
    benefitName,
    category,
    initialApprovalRole: initialApprovalRole,
    initialAssignedRules,
    initialBenefitDescription: description,
    initialIsCore,
    initialSubsidyPercent: subsidyPercent,
    initialVendorName: vendorName,
    categoryId,
    contractFile,
    initialIsActive,
    currentUserIdentifier,
    initialRequiresContract,
    isActive,
    isCore,
    name,
    onClose,
    onSaved,
    onSubmitted,
    requiresContract,
    subsidyPercentValue,
    vendorNameValue,
  });

  function handleRequiresContractChange(value: boolean) {
    setRequiresContract(value);
    if (!value) setContractFile(null);
  }

  function handleSpecificApproverChange(value: string) {
    const approver = findSpecificApprover(specificApproverOptions, value);
    setSpecificApproverId(approver?.id ?? "");
    if (approver) setApprovalRole(approver.role);
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex h-[760px] w-full max-w-[540px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white p-6">
        <EditBenefitDialogForm
          approvalRole={resolvedApprovalRole}
          assignedRules={assignedRules}
          availableRules={availableRules}
          benefitId={benefitId}
          benefitDescription={benefitDescription}
          benefitName={benefitName}
          category={category}
          contractFile={contractFile}
          isCore={isCore}
          name={name}
          onAddRule={handleAddRule}
          onApprovalRoleChange={setApprovalRole}
          onBenefitDescriptionChange={setBenefitDescription}
          onContractFileChange={setContractFile}
          onDeleteRule={handleDeleteRule}
          onIsActiveChange={setIsActive}
          onIsCoreChange={setIsCore}
          onNameChange={setName}
          onRequiresContractChange={handleRequiresContractChange}
          onSelectedRuleIdChange={setSelectedRuleId}
          onSpecificApproverChange={handleSpecificApproverChange}
          onSubsidyPercentChange={setSubsidyPercentValue}
          onVendorNameChange={setVendorNameValue}
          isActive={isActive}
          requiresContract={requiresContract}
          selectedRuleId={selectedRuleId}
          specificApproverId={resolvedSpecificApproverId}
          specificApproverOptions={specificApproverOptions}
          subsidyPercentValue={subsidyPercentValue}
          vendorNameValue={vendorNameValue}
        />
        <EditBenefitDialogFooter
          archiveComment={archiveComment}
          archiveMode={archiveMode}
          deleting={deleting}
          errorMessage={errorMessage}
          onArchiveCancel={() => {
            setArchiveComment("");
            setArchiveMode(false);
          }}
          onArchiveCommentChange={setArchiveComment}
          onArchiveClick={() => {
            setErrorMessage(null);
            setArchiveMode(true);
          }}
          onArchiveConfirm={() => handleDelete(archiveComment, setErrorMessage)}
          onCancel={onClose}
          onSave={() => handleSave(setErrorMessage)}
          updating={updating}
        />
      </div>
    </div>
  );
}
