import { ApprovalRole } from "@/shared/apollo/generated";

export type ApprovalRoleValue = ApprovalRole;

type RuleApprovalSectionProps = {
  approvalRole: ApprovalRoleValue;
  onApprovalRoleChange: (value: ApprovalRoleValue) => void;
};

export default function RuleApprovalSection({
  approvalRole,
  onApprovalRoleChange,
}: RuleApprovalSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-[16px] leading-4 font-semibold text-black">Approval Settings</h3>
        <p className="text-[14px] leading-5 text-[#64748B]">
          Choose which role should review this rule request before it is applied.
        </p>
      </div>

      <label className="flex max-w-[274px] flex-col gap-2">
        <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
          Approver Role
        </span>
        <select
          className="h-9 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none"
          onChange={(event) => onApprovalRoleChange(event.target.value as ApprovalRoleValue)}
          value={approvalRole}
        >
          <option value={ApprovalRole.HrAdmin}>HR</option>
          <option value={ApprovalRole.FinanceManager}>Finance Manager</option>
        </select>
      </label>
    </section>
  );
}
