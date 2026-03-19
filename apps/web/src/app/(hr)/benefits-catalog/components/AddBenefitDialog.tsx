"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useRef, useState } from "react";

import AddBenefitDialogFooter from "./AddBenefitDialogFooter";
import AddBenefitDialogForm from "./AddBenefitDialogForm";
import {
  ADD_BENEFIT_RULES_QUERY,
  type AddBenefitRulesQuery,
  type ApprovalRoleValue,
} from "./add-benefit-dialog.graphql";
import type { BenefitDraft } from "./benefit-draft";
import {
  buildSpecificApproverOptions,
  findSpecificApprover,
} from "./edit-benefit-dialog.approvers";
import { useBenefitRuleAssignments } from "./useBenefitRuleAssignments";
import { useAddBenefitDialogActions } from "./useAddBenefitDialogActions";

type AddBenefitDialogProps = {
  currentUserIdentifier: string;
  defaultCategoryId?: string | null;
  initialDraft?: BenefitDraft | null;
  onClose: () => void;
  onCreated?: () => void | Promise<unknown>;
  onDraftChange?: (draft: BenefitDraft | null) => void;
  onSubmitted?: (message: string) => void;
};

export default function AddBenefitDialog({
  currentUserIdentifier,
  defaultCategoryId,
  initialDraft,
  onClose,
  onCreated,
  onDraftChange,
  onSubmitted,
}: AddBenefitDialogProps) {
  const [name, setName] = useState(initialDraft?.name ?? "");
  const [description, setDescription] = useState(initialDraft?.description ?? "");
  const [categoryId] = useState(initialDraft?.categoryId ?? defaultCategoryId ?? "");
  const [subsidyPercent, setSubsidyPercent] = useState(String(initialDraft?.subsidyPercent ?? 50));
  const [vendorName, setVendorName] = useState(initialDraft?.vendorName ?? "");
  const [approvalRole, setApprovalRole] = useState<ApprovalRoleValue>(initialDraft?.approvalRole ?? "hr_admin");
  const [specificApproverId, setSpecificApproverId] = useState("");
  const [coreBenefitEnabled, setCoreBenefitEnabled] = useState(initialDraft?.coreBenefitEnabled ?? false);
  const [requiresContract, setRequiresContract] = useState(initialDraft?.requiresContract ?? false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorMessageRef = useRef<HTMLParagraphElement | null>(null);
  const { data } = useQuery<AddBenefitRulesQuery>(ADD_BENEFIT_RULES_QUERY);
  const specificApproverOptions = useMemo(() => buildSpecificApproverOptions(data?.employees), [data?.employees]);
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
    initialRules: [],
    ruleDefinitions: data?.ruleDefinitions,
  });
  const { handleCloseWithDraft, handleSave, saving } = useAddBenefitDialogActions({
    approvalRole: resolvedApprovalRole,
    assignedRules,
    categoryId,
    contractFile,
    coreBenefitEnabled,
    currentUserIdentifier,
    description,
    initialDraft,
    name,
    onClose,
    onCreated,
    onDraftChange,
    onSubmitted,
    requiresContract,
    subsidyPercent,
    vendorName,
  });
  useEffect(() => {
    if (!errorMessage) return;
    errorMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [errorMessage]);
  const parsedSubsidy = Number.parseInt(subsidyPercent, 10);
  const saveDisabled =
    !categoryId ||
    name.trim().length === 0 ||
    description.trim().length === 0 ||
    (requiresContract && vendorName.trim().length === 0) ||
    !Number.isInteger(parsedSubsidy) ||
    parsedSubsidy < 0 ||
    parsedSubsidy > 100 ||
    (requiresContract && !contractFile);

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
          handleCloseWithDraft();
        }
      }}
    >
      <div className="mx-auto flex h-[760px] w-full max-w-[540px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white p-6">
        <AddBenefitDialogForm
          approvalRole={resolvedApprovalRole}
          assignedRules={assignedRules}
          availableRules={availableRules}
          contractFile={contractFile}
          coreBenefitEnabled={coreBenefitEnabled}
          description={description}
          name={name}
          onAddRule={handleAddRule}
          onApprovalRoleChange={setApprovalRole}
          onContractFileChange={setContractFile}
          onCoreBenefitEnabledChange={setCoreBenefitEnabled}
          onDescriptionChange={setDescription}
          onNameChange={setName}
          onRequiresContractChange={handleRequiresContractChange}
          onRuleDelete={handleDeleteRule}
          onSelectedRuleIdChange={setSelectedRuleId}
          onSpecificApproverChange={handleSpecificApproverChange}
          onSubsidyPercentChange={setSubsidyPercent}
          onVendorNameChange={setVendorName}
          requiresContract={requiresContract}
          selectedRuleId={selectedRuleId}
          specificApproverId={resolvedSpecificApproverId}
          specificApproverOptions={specificApproverOptions}
          subsidyPercent={subsidyPercent}
          vendorName={vendorName}
        />

        {errorMessage ? (
          <div className="pb-3">
            <p
              className="w-full rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]"
              ref={errorMessageRef}
            >
              {errorMessage}
            </p>
          </div>
        ) : null}
        <AddBenefitDialogFooter
          onCancel={handleCloseWithDraft}
          onSave={() => handleSave(setErrorMessage)}
          saveDisabled={saveDisabled}
          saving={saving}
        />
      </div>
    </div>
  );
}
