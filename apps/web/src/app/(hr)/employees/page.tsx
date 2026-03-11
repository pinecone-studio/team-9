import HrPageShell from "../../HR/_components/HrPageShell";
import SectionPageContent from "../../HR/_components/SectionPageContent";

const cards = [
  {
    description:
      "Use this page to watch headcount changes and identify teams needing support.",
    rows: [
      { label: "Engineering", value: "8" },
      { label: "Operations", value: "5" },
      { label: "People Team", value: "3" },
    ],
    title: "Headcount Snapshot",
  },
  {
    description:
      "Probation status helps HR schedule reviews and confirm manager sign-off.",
    rows: [
      { label: "Review this week", value: "2" },
      { label: "Pending documents", value: "1" },
      { label: "Ready for conversion", value: "1" },
    ],
    title: "Probation Overview",
  },
] as const;

const sidebarItems = [
  {
    detail: "Three employees updated contact and dependent information today.",
    title: "Profile updates waiting sync",
  },
  {
    detail: "Two managers still need to confirm probation review notes.",
    title: "Manager actions required",
  },
  {
    detail:
      "One offboarding checklist is still missing asset return confirmation.",
    title: "Offboarding follow-up",
  },
] as const;

export default function EmployeesPage() {
  return (
    <HrPageShell
      activeKey="employees"
      subtitle="Browse employee records, headcount changes, and status updates."
      title="Employees"
    >
      <SectionPageContent
        cards={[cards[0], cards[1]]}
        sidebarItems={[sidebarItems[0], sidebarItems[1], sidebarItems[2]]}
        sidebarTitle="Team Notes"
      />
    </HrPageShell>
  );
}
