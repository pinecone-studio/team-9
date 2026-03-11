import HrPageShell from "../../HR/_components/HrPageShell";
import SectionPageContent from "../../HR/_components/SectionPageContent";

const cards = [
  {
    description:
      "Focus on requests that are aging or blocked on missing employee documents.",
    rows: [
      { label: "Gym Membership", value: "5 pending" },
      { label: "Meal Subsidy", value: "2 escalated" },
      { label: "Transport Benefit", value: "3 new" },
    ],
    title: "Pending Review",
  },
  {
    description:
      "Approval timing helps HR stay within policy and service expectations.",
    rows: [
      { label: "Avg. approval time", value: "1.8 days" },
      { label: "Over SLA", value: "4" },
      { label: "Approved today", value: "11" },
    ],
    title: "Approval SLA",
  },
] as const;

const sidebarItems = [
  {
    detail:
      "Benefit requests older than two days should be checked before shift close.",
    title: "4 requests need immediate review",
  },
  {
    detail:
      "Two approvals are blocked by missing employee eligibility confirmation.",
    title: "Eligibility confirmation missing",
  },
  {
    detail:
      "Weekly payroll export runs tomorrow, so pending reimbursements should be cleared.",
    title: "Payroll cutoff tomorrow",
  },
] as const;

export default function RequestsPage() {
  return (
    <HrPageShell
      activeKey="requests"
      subtitle="Approve, reject, and monitor employee benefit request queues."
      title="Requests"
    >
      <SectionPageContent
        cards={[cards[0], cards[1]]}
        sidebarItems={[sidebarItems[0], sidebarItems[1], sidebarItems[2]]}
        sidebarTitle="Queue Notes"
      />
    </HrPageShell>
  );
}
