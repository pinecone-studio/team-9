"use client";

import { useState } from "react";

import HrPageShell from "../../HR/_components/HrPageShell";
import EligibilityRulesHeader from "./components/EligibilityRulesHeader";
import RuleSectionList from "./components/RuleSectionList";

type EligibilityRulesPageContentProps = {
  currentUserIdentifier: string;
};

export default function EligibilityRulesPageContent({
  currentUserIdentifier,
}: EligibilityRulesPageContentProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <HrPageShell
      activeKey="eligibility-rules"
      hideHeader
      subtitle="Control who qualifies for benefits and validate rule changes."
      title="Eligibility Rules"
    >
      <EligibilityRulesHeader
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
      />
      <RuleSectionList
        currentUserIdentifier={currentUserIdentifier}
        searchTerm={searchTerm}
      />
    </HrPageShell>
  );
}
