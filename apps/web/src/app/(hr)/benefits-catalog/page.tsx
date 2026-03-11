import HrPageShell from "../../HR/_components/HrPageShell";
import SectionPageContent from "../../HR/_components/SectionPageContent";

const cards = [
  {
    description:
      "Track what employees can enroll in and which plans need updates.",
    rows: [
      { label: "Health Insurance", value: "Active" },
      { label: "Gym Membership", value: "Popular" },
      { label: "Meal Subsidy", value: "Draft" },
    ],
    title: "Available Benefits",
  },
  {
    description:
      "Review coverage across employment types before publishing changes.",
    rows: [
      { label: "Full-time Plans", value: "18" },
      { label: "Contract Plans", value: "6" },
      { label: "Remote Plans", value: "9" },
    ],
    title: "Catalog Coverage",
  },
] as const;

const sidebarItems = [
  {
    detail:
      "Finalize the open enrollment package before the next payroll cycle.",
    title: "Enrollment closes in 12 days",
  },
  {
    detail:
      "A new commuter reimbursement option is waiting for HR approval.",
    title: "1 benefit draft pending review",
  },
  {
    detail:
      "Archived plans remain searchable for audit and employee support.",
    title: "3 archived plans available",
  },
] as const;

export default function BenefitsCatalogPage() {
  return (
    <HrPageShell
      activeKey="benefits-catalog"
      subtitle="Review, publish, and maintain employee benefit offerings."
      title="Benefits Catalog"
    >
      <SectionPageContent
        cards={[cards[0], cards[1]]}
        sidebarItems={[sidebarItems[0], sidebarItems[1], sidebarItems[2]]}
        sidebarTitle="Catalog Notes"
      />
    </HrPageShell>
  );
}
