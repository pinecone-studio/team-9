import HrPageShell from "../../HR/_components/HrPageShell";
import EligibilityRulesHeader from "./components/EligibilityRulesHeader";
import RuleSectionList from "./components/RuleSectionList";

export default function EligibilityRulesPage() {
  return (
    <HrPageShell
      activeKey="eligibility-rules"
      hideHeader
      subtitle="Control who qualifies for benefits and validate rule changes."
      title="Eligibility Rules"
    >
      <EligibilityRulesHeader />
      <RuleSectionList />
    </HrPageShell>
  );
}
