"use client";

import { useState } from "react";

import BenefitsCatalogHeader from "./BenefitsCatalogHeader";
import WellnessSection from "./WellnessSection";

export default function BenefitsCatalogContent() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <BenefitsCatalogHeader
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      <WellnessSection searchQuery={searchQuery} />
    </>
  );
}
