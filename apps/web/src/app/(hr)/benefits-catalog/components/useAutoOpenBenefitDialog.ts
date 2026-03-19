import { useEffect, useRef } from "react";
import type { BenefitCard } from "../benefit-types";

type UseAutoOpenBenefitDialogProps = {
  benefits: readonly BenefitCard[];
  requestedBenefitId?: string | null;
  setSelectedBenefit: (benefit: BenefitCard | null) => void;
};

export function useAutoOpenBenefitDialog({
  benefits,
  requestedBenefitId,
  setSelectedBenefit,
}: UseAutoOpenBenefitDialogProps) {
  const autoOpenedBenefitIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!requestedBenefitId) {
      autoOpenedBenefitIdRef.current = null;
      return;
    }

    if (autoOpenedBenefitIdRef.current === requestedBenefitId) {
      return;
    }

    const matchingBenefit = benefits.find((benefit) => benefit.id === requestedBenefitId);

    if (!matchingBenefit) {
      return;
    }

    setSelectedBenefit(matchingBenefit);
    autoOpenedBenefitIdRef.current = requestedBenefitId;
  }, [benefits, requestedBenefitId, setSelectedBenefit]);
}
