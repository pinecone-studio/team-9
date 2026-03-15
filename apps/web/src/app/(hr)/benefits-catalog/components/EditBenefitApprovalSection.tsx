import type { ApprovalRoleValue } from "./edit-benefit-dialog.graphql";

type EditBenefitApprovalSectionProps = {
  approvalRole: ApprovalRoleValue;
  onApprovalRoleChange: (value: ApprovalRoleValue) => void;
};

export default function EditBenefitApprovalSection({
  approvalRole,
  onApprovalRoleChange,
}: EditBenefitApprovalSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-[16px] leading-4 font-semibold text-black">Approval Settings</h3>
        <p className="text-[14px] leading-5 text-[#64748B]">
          Define who can approve employee requests for this benefit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[274px_1fr]">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
            Approver Role
          </span>
          <select
            className="h-9 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none"
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
          <div className="flex h-9 items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 text-[#A1A1AA] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <span>Search for an employee...</span>
          </div>
          <p className="text-[12px] leading-4 text-[#737373]">
            If selected later, this person will receive all approval requests instead of the role group.
          </p>
        </div>
      </div>
    </section>
  );
}
