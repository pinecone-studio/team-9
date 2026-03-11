import HrPageShell from "../../HR/_components/HrPageShell";
import SectionPageContent from "../../HR/_components/SectionPageContent";

const cards = [
  {
    description:
      "Review grouped rules to make sure employees are matched to the correct plans.",
    rows: [
      { label: "Employment Type Rules", value: "12" },
      { label: "Location Rules", value: "7" },
      { label: "Tenure Rules", value: "5" },
    ],
    title: "Rule Groups",
  },
  {
    description:
      "Recent edits should be validated before they become effective for employees.",
    rows: [
      { label: "Updated this week", value: "6" },
      { label: "Need approval", value: "2" },
      { label: "Conflicts flagged", value: "1" },
    ],
    title: "Recent Changes",
  },
] as const;

const sidebarItems = [
  {
    detail:
      "One contractor rule overlaps with the remote employee eligibility set.",
    title: "Conflict detected in contractor rules",
  },
  {
    detail:
      "Upcoming location rollout needs a matching benefits matrix before launch.",
    title: "New office rollout pending rule pack",
  },
  {
    detail:
      "Validation checks passed for the latest probation-to-full-time conversion rule.",
    title: "Latest validation succeeded",
  },
] as const;

export default function EligibilityRulesPage() {
  return (
    <HrPageShell
      activeKey="eligibility-rules"
      subtitle="Control who qualifies for benefits and validate rule changes."
      title="Eligibility Rules"
    >
      <SectionPageContent
        cards={[cards[0], cards[1]]}
        sidebarItems={[sidebarItems[0], sidebarItems[1], sidebarItems[2]]}
        sidebarTitle="Validation Notes"
      />
    </HrPageShell>
  );
}
