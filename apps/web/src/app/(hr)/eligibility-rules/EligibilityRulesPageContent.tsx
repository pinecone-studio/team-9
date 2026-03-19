"use client";

import { useState } from "react";

import HrPageShell from "../../HR/_components/HrPageShell";
import RuleSectionList from "./components/RuleSectionList";

type EligibilityRulesPageContentProps = {
  currentUserIdentifier: string;
  requestedCreateSection?: string | null;
  shouldAutoOpenCreateRule?: boolean;
};

export default function EligibilityRulesPageContent({
  currentUserIdentifier,
  requestedCreateSection,
  shouldAutoOpenCreateRule = false,
}: EligibilityRulesPageContentProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <HrPageShell
      activeKey="eligibility-rules"
      hideHeader
      subtitle="Control who qualifies for benefits and validate rule changes."
      title="Eligibility Rules"
    >
      <RuleSectionList
        currentUserIdentifier={currentUserIdentifier}
        onSearchChange={setSearchTerm}
        requestedCreateSection={requestedCreateSection}
        searchTerm={searchTerm}
        shouldAutoOpenCreateRule={shouldAutoOpenCreateRule}
      />
    </HrPageShell>
  );
}
