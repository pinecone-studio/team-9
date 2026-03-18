import AddBenefitContractUpload from "./AddBenefitContractUpload";
import AddBenefitValueFields from "./AddBenefitValueFields";
import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";
import BenefitDialogToggle from "./BenefitDialogToggle";
import EditBenefitApprovalSection from "./EditBenefitApprovalSection";
import EditBenefitRulesSection from "./EditBenefitRulesSection";
import type { ApprovalRoleValue, AvailableRuleDefinition } from "./add-benefit-dialog.graphql";
import type { AssignedBenefitRule } from "./edit-benefit-dialog.types";

type AddBenefitDialogFormProps = {
  approvalRole: ApprovalRoleValue;
  assignedRules: AssignedBenefitRule[];
  availableRules: AvailableRuleDefinition[];
  contractFile: File | null;
  coreBenefitEnabled: boolean;
  description: string;
  name: string;
  onAddRule: () => void;
  onApprovalRoleChange: (value: ApprovalRoleValue) => void;
  onContractFileChange: (file: File | null) => void;
  onCoreBenefitEnabledChange: (value: boolean) => void;
  onDescriptionChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onRequiresContractChange: (value: boolean) => void;
  onRuleDelete: (ruleId: string) => void;
  onSelectedRuleIdChange: (value: string) => void;
  onSubsidyPercentChange: (value: string) => void;
  onVendorNameChange: (value: string) => void;
  requiresContract: boolean;
  selectedRuleId: string;
  subsidyPercent: string;
  vendorName: string;
};
export default function AddBenefitDialogForm({
  approvalRole,
  assignedRules,
  availableRules,
  contractFile,
  coreBenefitEnabled,
  description,
  name,
  onAddRule,
  onApprovalRoleChange,
  onContractFileChange,
  onCoreBenefitEnabledChange,
  onDescriptionChange,
  onNameChange,
  onRequiresContractChange,
  onRuleDelete,
  onSelectedRuleIdChange,
  onSubsidyPercentChange,
  onVendorNameChange,
  requiresContract,
  selectedRuleId,
  subsidyPercent,
  vendorName,
}: AddBenefitDialogFormProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-full flex-col items-start gap-8 px-[2px]">
        <div className="sticky top-0 z-10 flex w-full flex-col items-start gap-2 bg-white pb-2">
          <h2 className="w-full text-[18px] leading-7 font-semibold text-[#0F172A]">
            Add a New Benefit
          </h2>
          <p className="w-full text-[14px] leading-5 font-normal text-[#64748B]">
            Add a benefit and define the requirements employees must meet to receive it.
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-4">
          <BenefitDialogFieldLabel>Benefit Name</BenefitDialogFieldLabel>
          <input
            className="h-9 w-[300px] rounded-[6px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0F172A] outline-none"
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Name"
            type="text"
            value={name}
          />
        </div>

        <label className="flex w-full flex-col items-start gap-2">
          <BenefitDialogFieldLabel>Description</BenefitDialogFieldLabel>
          <textarea
            className="min-h-24 w-full rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Explain how this benefit works and what employees get from it..."
            value={description}
          />
        </label>

        <div className="w-full border-t border-[#DBDEE1]" />

        <AddBenefitValueFields
          onSubsidyPercentChange={onSubsidyPercentChange}
          onVendorNameChange={onVendorNameChange}
          requiresContract={requiresContract}
          subsidyPercent={subsidyPercent}
          vendorName={vendorName}
        />

        <div className="w-full border-t border-[#DBDEE1]" />

        <EditBenefitRulesSection
          assignedRules={assignedRules}
          availableRules={availableRules}
          isCore={coreBenefitEnabled}
          onAddRule={onAddRule}
          onDeleteRule={onRuleDelete}
          onSelectedRuleIdChange={onSelectedRuleIdChange}
          selectedRuleId={selectedRuleId}
        />

        <div className="w-full border-t border-[#DBDEE1]" />

        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start gap-[5px]">
            <span className="text-[14px] leading-4 font-medium text-black">Core Benefit</span>
            <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
              Available to all employees
            </span>
          </div>
          <BenefitDialogToggle
            checked={coreBenefitEnabled}
            onCheckedChange={onCoreBenefitEnabledChange}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start gap-[2px]">
              <span className="text-[14px] leading-4 font-medium text-black">Requires Contract</span>
              <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
                Employee must sign an agreement
              </span>
            </div>
            <BenefitDialogToggle
              checked={requiresContract}
              onCheckedChange={onRequiresContractChange}
            />
          </div>

          <AddBenefitContractUpload
            contractFile={contractFile}
            onContractFileChange={onContractFileChange}
            requiresContract={requiresContract}
          />
        </div>

        <EditBenefitApprovalSection
          approvalRole={approvalRole}
          onApprovalRoleChange={onApprovalRoleChange}
        />
      </div>
    </div>
  );
}
