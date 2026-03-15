import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";
import BenefitDialogToggle from "./BenefitDialogToggle";
import EditBenefitApprovalSection from "./EditBenefitApprovalSection";
import EditBenefitAuditSection from "./EditBenefitAuditSection";
import EditBenefitContractPanel from "./EditBenefitContractPanel";
import EditBenefitRulesSection from "./EditBenefitRulesSection";
import type { ApprovalRoleValue } from "./edit-benefit-dialog.graphql";
import type { AssignedBenefitRule, RuleOption } from "./edit-benefit-dialog.types";

type EditBenefitDialogFormProps = {
  approvalRole: ApprovalRoleValue;
  assignedRules: AssignedBenefitRule[];
  availableRules: RuleOption[];
  benefitDescription: string;
  benefitName: string;
  category: string;
  isCore: boolean;
  name: string;
  onAddRule: () => void;
  onApprovalRoleChange: (value: ApprovalRoleValue) => void;
  onBenefitDescriptionChange: (value: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onIsCoreChange: (checked: boolean) => void;
  onNameChange: (value: string) => void;
  onRequiresContractChange: (checked: boolean) => void;
  onSelectedRuleIdChange: (value: string) => void;
  onSubsidyPercentChange: (value: string) => void;
  onVendorNameChange: (value: string) => void;
  requiresContract: boolean;
  selectedRuleId: string;
  subsidyPercentValue: string;
  vendorNameValue: string;
};

export default function EditBenefitDialogForm({
  approvalRole,
  assignedRules,
  availableRules,
  benefitDescription,
  benefitName,
  category,
  isCore,
  name,
  onAddRule,
  onApprovalRoleChange,
  onBenefitDescriptionChange,
  onDeleteRule,
  onIsCoreChange,
  onNameChange,
  onRequiresContractChange,
  onSelectedRuleIdChange,
  onSubsidyPercentChange,
  onVendorNameChange,
  requiresContract,
  selectedRuleId,
  subsidyPercentValue,
  vendorNameValue,
}: EditBenefitDialogFormProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col gap-8 px-[2px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">Edit Benefit</h2>
          <div className="flex items-center gap-2 text-[14px] leading-5 text-[#64748B]">
            <span>{category}</span>
            <span className="inline-block h-px w-2 bg-[#64748B]" />
            <span>{benefitName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <BenefitDialogFieldLabel>Benefit Name</BenefitDialogFieldLabel>
          <input
            className="h-9 w-[300px] rounded-[6px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0F172A] outline-none"
            onChange={(event) => onNameChange(event.target.value)}
            type="text"
            value={name}
          />
        </div>

        <label className="flex flex-col gap-2">
          <BenefitDialogFieldLabel>Description</BenefitDialogFieldLabel>
          <textarea
            className="min-h-24 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none"
            onChange={(event) => onBenefitDescriptionChange(event.target.value)}
            value={benefitDescription}
          />
        </label>

        <div className="border-t border-[#DBDEE1]" />

        <section className="flex flex-col gap-5">
          <h3 className="text-[16px] leading-4 font-semibold text-black">Benefit Value</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-[10px]">
              <BenefitDialogFieldLabel>Subsidy Percent</BenefitDialogFieldLabel>
              <input
                className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 outline-none"
                max={100}
                min={0}
                onChange={(event) => onSubsidyPercentChange(event.target.value)}
                type="number"
                value={subsidyPercentValue}
              />
            </label>

            <label className="flex flex-col gap-[10px]">
              <BenefitDialogFieldLabel>Vendor name</BenefitDialogFieldLabel>
              <input
                className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 outline-none"
                onChange={(event) => onVendorNameChange(event.target.value)}
                type="text"
                value={vendorNameValue}
              />
            </label>
          </div>
        </section>

        <div className="border-t border-[#DBDEE1]" />

        <EditBenefitRulesSection
          assignedRules={assignedRules}
          availableRules={availableRules}
          isCore={isCore}
          onAddRule={onAddRule}
          onDeleteRule={onDeleteRule}
          onSelectedRuleIdChange={onSelectedRuleIdChange}
          selectedRuleId={selectedRuleId}
        />

        <div className="border-t border-[#DBDEE1]" />

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[5px]">
            <span className="text-[14px] leading-4 font-medium text-black">Core Benefit</span>
            <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
              Available to all employees
            </span>
          </div>
          <BenefitDialogToggle checked={isCore} onCheckedChange={onIsCoreChange} />
        </div>

        <EditBenefitContractPanel
          checked={requiresContract}
          onCheckedChange={onRequiresContractChange}
        />

        <EditBenefitAuditSection benefitName={benefitName} />

        <EditBenefitApprovalSection
          approvalRole={approvalRole}
          onApprovalRoleChange={onApprovalRoleChange}
        />
      </div>
    </div>
  );
}
