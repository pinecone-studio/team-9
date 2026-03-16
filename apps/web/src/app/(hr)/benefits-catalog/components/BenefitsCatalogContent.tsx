"use client";

import { useState } from "react";

import BenefitsCatalogHeader from "./BenefitsCatalogHeader";
import WellnessSection from "./WellnessSection";

type BenefitsCatalogContentProps = {
  currentUserIdentifier: string;
};

export default function BenefitsCatalogContent({
  currentUserIdentifier,
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
        searchQuery={searchQuery}
      />
    </>
  );
}
