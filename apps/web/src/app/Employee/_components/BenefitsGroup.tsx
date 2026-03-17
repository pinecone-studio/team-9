"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BenefitCardItem } from "./BenefitCardItem";
import { BenefitSectionHeader } from "./BenefitSectionHeader";
import EmployeeBenefitDialog from "./EmployeeBenefitDialog";
import type { EmployeeBenefitCard, EmployeeBenefitSection } from "./employee-types";

type BenefitsGroupProps = {
  currentUserIdentifier: string;
  employeeId: string;
  section: EmployeeBenefitSection;
};

export function BenefitsGroup({
  currentUserIdentifier,
  employeeId,
  section,
}: BenefitsGroupProps) {
  const router = useRouter();
  const { items, title } = section;
  const [selectedCard, setSelectedCard] = useState<EmployeeBenefitCard | null>(null);

  return (
    <>
      <BenefitSectionHeader itemCount={items.length} title={title} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((card) => (
          <BenefitCardItem
            card={card}
            key={card.id}
            onSelect={setSelectedCard}
          />
        ))}
      </div>
      {selectedCard ? (
        <EmployeeBenefitDialog
          card={selectedCard}
          currentUserIdentifier={currentUserIdentifier}
          employeeId={employeeId}
          onClose={() => setSelectedCard(null)}
          onSubmitted={async () => {
            await router.refresh();
          }}
        />
      ) : null}
    </>
  );
}
