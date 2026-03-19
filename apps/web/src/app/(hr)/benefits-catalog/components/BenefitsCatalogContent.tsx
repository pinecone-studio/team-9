"use client";

import { useState } from "react";

import BenefitsCatalogHeader from "./BenefitsCatalogHeader";
import WellnessSection from "./WellnessSection";

type BenefitsCatalogContentProps = {
  currentUserIdentifier: string;
  requestedBenefitId?: string | null;
};

export default function BenefitsCatalogContent({
  currentUserIdentifier,
  requestedBenefitId,
}: BenefitsCatalogContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <BenefitsCatalogHeader
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      <WellnessSection
        currentUserIdentifier={currentUserIdentifier}
        requestedBenefitId={requestedBenefitId}
        searchQuery={searchQuery}
      />
    </>
  );
}
