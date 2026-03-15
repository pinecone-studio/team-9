"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";

import AddBenefitDialogFooter from "./AddBenefitDialogFooter";
import AddBenefitDialogForm from "./AddBenefitDialogForm";
import {
  ADD_BENEFIT_RULES_QUERY,
  type AddBenefitRulesQuery,
  type ApprovalRoleValue,
} from "./add-benefit-dialog.graphql";
import type { BenefitDraft } from "./benefit-draft";
import { useBenefitRuleAssignments } from "./useBenefitRuleAssignments";
import { useAddBenefitDialogActions } from "./useAddBenefitDialogActions";

type AddBenefitDialogProps = {
  defaultCategoryId?: string | null;
  initialDraft?: BenefitDraft | null;
  onClose: () => void;
  onCreated?: () => void | Promise<unknown>;
  onDraftChange?: (draft: BenefitDraft | null) => void;
};

export default function AddBenefitDialog({
  defaultCategoryId,
  initialDraft,
  onClose,
  onCreated,
  onDraftChange,
}: AddBenefitDialogProps) {
  const [name, setName] = useState(initialDraft?.name ?? "");
  const [description, setDescription] = useState(initialDraft?.description ?? "");
  const [categoryId] = useState(initialDraft?.categoryId ?? defaultCategoryId ?? "");
  const [subsidyPercent, setSubsidyPercent] = useState(
    String(initialDraft?.subsidyPercent ?? 50),
  );
  const [vendorName, setVendorName] = useState(initialDraft?.vendorName ?? "");
  const [approvalRole, setApprovalRole] = useState<ApprovalRoleValue>(
    initialDraft?.approvalRole ?? "hr_admin",
  );
  const [coreBenefitEnabled, setCoreBenefitEnabled] = useState(
    initialDraft?.coreBenefitEnabled ?? false,
  );
  const [requiresContract, setRequiresContract] = useState(
    initialDraft?.requiresContract ?? false,
  );
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorMessageRef = useRef<HTMLParagraphElement | null>(null);

  const { data } = useQuery<AddBenefitRulesQuery>(ADD_BENEFIT_RULES_QUERY);
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
    approvalRole,
    assignedRules,
    categoryId,
    contractFile,
    coreBenefitEnabled,
    description,
    initialDraft,
    name,
    onClose,
    onCreated,
    onDraftChange,
    requiresContract,
    subsidyPercent,
    vendorName,
  });

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

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
    vendorName.trim().length === 0 ||
    !Number.isInteger(parsedSubsidy) ||
    parsedSubsidy < 0 ||
    parsedSubsidy > 100 ||
    (requiresContract && !contractFile);

  function handleRequiresContractChange(value: boolean) {
    setRequiresContract(value);
    if (!value) {
      setContractFile(null);
    }
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
      <div className="mx-auto flex h-full max-h-[calc(100vh-48px)] w-full max-w-[626px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white">
        <AddBenefitDialogForm
          approvalRole={approvalRole}
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
          onSubsidyPercentChange={setSubsidyPercent}
          onVendorNameChange={setVendorName}
          requiresContract={requiresContract}
          selectedRuleId={selectedRuleId}
          subsidyPercent={subsidyPercent}
          vendorName={vendorName}
        />

        {errorMessage ? (
          <div className="px-6 pb-3">
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
