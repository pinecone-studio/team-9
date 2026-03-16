"use client";

import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import EditBenefitDialogFooter from "./EditBenefitDialogFooter";
import EditBenefitDialogForm from "./EditBenefitDialogForm";
import {
  BENEFIT_EDIT_RULES_QUERY,
  type ApprovalRoleValue,
  type BenefitEditRulesQuery,
  type BenefitEditRulesVariables,
} from "./edit-benefit-dialog.graphql";
import { useBenefitRuleAssignments } from "./useBenefitRuleAssignments";
import { useEditBenefitDialogActions } from "./useEditBenefitDialogActions";

type EditBenefitDialogProps = {
  approvalRole: ApprovalRoleValue;
  benefitId: string;
  benefitName: string;
  category: string;
  categoryId: string;
  description: string;
  enabled: boolean;
  isCore: boolean;
  requiresContract: boolean;
  subsidyPercent: number;
  vendorName: string;
  onDeleted?: (benefitId: string) => void | Promise<unknown>;
  onSaved?: () => void | Promise<unknown>;
  onClose: () => void;
};

export default function EditBenefitDialog({
  approvalRole: initialApprovalRole,
  benefitId,
  benefitName,
  category,
  categoryId,
  description,
  enabled: initialIsActive,
  isCore: initialIsCore,
  requiresContract: initialRequiresContract,
  subsidyPercent,
  vendorName,
  onDeleted,
  onSaved,
  onClose,
}: EditBenefitDialogProps) {
  const [name, setName] = useState(benefitName);
  const [benefitDescription, setBenefitDescription] = useState(description);
  const [subsidyPercentValue, setSubsidyPercentValue] = useState(String(subsidyPercent));
  const [vendorNameValue, setVendorNameValue] = useState(vendorName);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [approvalRole, setApprovalRole] = useState<ApprovalRoleValue>(initialApprovalRole);
  const [isCore, setIsCore] = useState(initialIsCore);
  const [requiresContract, setRequiresContract] = useState(initialRequiresContract);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data } = useQuery<BenefitEditRulesQuery, BenefitEditRulesVariables>(
    BENEFIT_EDIT_RULES_QUERY,
    {
      variables: { benefitId },
    },
  );
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
  const { deleting, handleDelete, handleSave, updating } = useEditBenefitDialogActions({
    approvalRole,
    assignedRules,
    benefitDescription,
    benefitId,
    categoryId,
    contractFile,
    initialIsActive,
    initialRequiresContract,
    isActive,
    isCore,
    name,
    onClose,
    onDeleted,
    onSaved,
    requiresContract,
    subsidyPercentValue,
    vendorNameValue,
  });

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
          onClose();
        }
      }}
    >
      <div className="mx-auto flex h-full max-h-[calc(100vh-48px)] w-full max-w-[626px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white">
        <EditBenefitDialogForm
          approvalRole={approvalRole}
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
          onSubsidyPercentChange={setSubsidyPercentValue}
          onVendorNameChange={setVendorNameValue}
          isActive={isActive}
          requiresContract={requiresContract}
          selectedRuleId={selectedRuleId}
          subsidyPercentValue={subsidyPercentValue}
          vendorNameValue={vendorNameValue}
        />
        <EditBenefitDialogFooter
          deleting={deleting}
          errorMessage={errorMessage}
          onCancel={onClose}
          onDelete={() => handleDelete(setErrorMessage)}
          onSave={() => handleSave(setErrorMessage)}
          updating={updating}
        />
      </div>
    </div>
  );
}
