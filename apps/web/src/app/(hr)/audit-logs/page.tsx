import HrPageShell from "../../HR/_components/HrPageShell";
import SectionPageContent from "../../HR/_components/SectionPageContent";

const cards = [
  {
    description:
      "Keep a record of benefit updates, approvals, and profile changes made by HR.",
    rows: [
      { label: "Benefit changes", value: "16 today" },
      { label: "Profile edits", value: "9 today" },
      { label: "Approval actions", value: "22 today" },
    ],
    title: "Recent Events",
  },
  {
    description:
      "System checks help confirm there are no silent failures in policy tracking.",
    rows: [
      { label: "Export jobs", value: "Healthy" },
      { label: "Webhook sync", value: "Healthy" },
      { label: "Policy snapshots", value: "1 delayed" },
    ],
    title: "System Checks",
  },
] as const;

const sidebarItems = [
  {
    detail:
      "One scheduled snapshot ran late after the last rules import and should be reviewed.",
    title: "Delayed snapshot requires follow-up",
  },
  {
    detail:
      "All approval actions are traceable to named reviewers in the current audit set.",
    title: "Reviewer trail complete",
  },
  {
    detail:
      "Exports generated for payroll and compliance are available for download.",
    title: "Latest exports ready",
  },
] as const;

export default function AuditLogsPage() {
  return (
    <HrPageShell
      activeKey="audit-logs"
      subtitle="Track system activity, approvals, and policy changes over time."
      title="Audit Logs"
    >
      <SectionPageContent
        cards={[cards[0], cards[1]]}
        sidebarItems={[sidebarItems[0], sidebarItems[1], sidebarItems[2]]}
        sidebarTitle="Audit Notes"
      />
    </HrPageShell>
  );
}
