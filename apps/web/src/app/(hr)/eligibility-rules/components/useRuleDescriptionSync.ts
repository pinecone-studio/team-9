import { useState } from "react";
import type { RuleValueType } from "@/shared/apollo/generated";

import { formatRulePreview } from "./rule-backend-formatters";

type UseRuleDescriptionSyncParams = {
  initialConfigLabel: string;
  initialUnit: string;
  initialValue: string;
  initialValueType: RuleValueType;
  ruleLabel: string;
};

export function useRuleDescriptionSync({
  initialConfigLabel,
  initialUnit,
  initialValue,
  initialValueType,
  ruleLabel,
}: UseRuleDescriptionSyncParams) {
  const initialPreviewText = formatRulePreview({
    configLabel: initialConfigLabel,
    ruleLabel,
    unit: initialUnit,
    value: initialValue,
    valueType: initialValueType,
  });

  const [description, setDescription] = useState(initialPreviewText);
  const [isDescriptionAuto, setIsDescriptionAuto] = useState(true);

  function syncDescriptionIfNeeded(params: {
    configLabel: string;
    unit: string;
    value: string;
    valueType: RuleValueType;
  }) {
    if (!isDescriptionAuto) {
      return;
    }

    setDescription(
      formatRulePreview({
        configLabel: params.configLabel,
        ruleLabel,
        unit: params.unit,
        value: params.value,
        valueType: params.valueType,
      }),
    );
  }

  function handleDescriptionChange(nextDescription: string, previewText: string) {
    setDescription(nextDescription);
    setIsDescriptionAuto(nextDescription.trim() === previewText.trim());
  }

  return {
    description,
    handleDescriptionChange,
    syncDescriptionIfNeeded,
  };
}
