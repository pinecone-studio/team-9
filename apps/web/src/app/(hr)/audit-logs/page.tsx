import HrPageShell from "../../HR/_components/HrPageShell";
import AuditLogs from "../../HR/_components/dashboard/Audit-Logs";

export default function AuditLogsPage() {
  return (
    <HrPageShell
      activeKey="audit-logs"
      subtitle="Track system activity, approvals, overrides, and eligibility decisions."
      title="Audit Logs"
      hideHeader={true}
    >
      <AuditLogs />
    </HrPageShell>
  );
}
