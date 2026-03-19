import type { ApprovalRoleValue } from "./edit-benefit-dialog.graphql";
import type { SpecificApproverOption } from "./edit-benefit-dialog.types";

type EditBenefitApprovalSectionProps = {
  approvalRole: ApprovalRoleValue;
  onApprovalRoleChange: (value: ApprovalRoleValue) => void;
  onSpecificApproverChange?: (value: string) => void;
  specificApproverId?: string;
  specificApproverOptions?: SpecificApproverOption[];
};

export default function EditBenefitApprovalSection({
  approvalRole,
  onApprovalRoleChange,
  onSpecificApproverChange,
  specificApproverId = "",
  specificApproverOptions = [],
}: EditBenefitApprovalSectionProps) {
  const hasSpecificApprover = specificApproverId.length > 0;

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-[16px] leading-4 font-semibold text-black">Approval Settings</h3>
        <p className="text-[14px] leading-5 text-[#64748B]">
          Define who can approve employee requests for this benefit.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[274px_198px]">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
            Approver Role
          </span>
          <select
            className="h-9 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#94A3B8]"
            disabled={hasSpecificApprover}
            onChange={(event) => onApprovalRoleChange(event.target.value as ApprovalRoleValue)}
            value={approvalRole}
          >
            <option value="hr_admin">HR</option>
            <option value="finance_manager">Finance Manager</option>
          </select>
        </label>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
              Specific Approver
            </span>
            <span className="text-[14px] leading-[14px] text-[#737373]">(optional)</span>
          </div>
          <select
            className="h-9 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none"
            onChange={(event) => onSpecificApproverChange?.(event.target.value)}
            value={specificApproverId}
          >
            <option value="">Search for an employee...</option>
            {specificApproverOptions.map((approver) => (
              <option key={approver.id} value={approver.id}>
                {approver.label}
              </option>
            ))}
          </select>
          <p className="min-h-12 text-[12px] leading-4 text-[#737373]">
            {specificApproverOptions.length > 0
              ? "If selected, this person will receive all approval requests instead of the role group."
              : "No HR or Finance approvers are available."}
          </p>
        </div>
      </div>
    </section>
  );
}
