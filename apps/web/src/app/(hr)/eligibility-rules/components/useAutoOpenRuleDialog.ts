import { useEffect, useRef } from "react";

const DEFAULT_SECTION_TITLE = "Gate Rules";

type UseAutoOpenRuleDialogProps = {
  requestedCreateSection?: string | null;
  shouldAutoOpenCreateRule?: boolean;
  setActiveSection: (sectionTitle: string | null) => void;
};

export function useAutoOpenRuleDialog({
  requestedCreateSection,
  shouldAutoOpenCreateRule = false,
  setActiveSection,
}: UseAutoOpenRuleDialogProps) {
  const consumedSectionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!shouldAutoOpenCreateRule) {
      consumedSectionRef.current = null;
      return;
    }

    const nextSectionTitle = requestedCreateSection?.trim() || DEFAULT_SECTION_TITLE;

    if (consumedSectionRef.current === nextSectionTitle) {
      return;
    }

    setActiveSection(nextSectionTitle);
    consumedSectionRef.current = nextSectionTitle;
  }, [requestedCreateSection, setActiveSection, shouldAutoOpenCreateRule]);
}
