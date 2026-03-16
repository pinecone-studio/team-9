import { RuleValueType } from "@/shared/apollo/generated";

export function parseOptionsJson(optionsJson?: string | null): {
  configLabel?: string;
  options: string[];
} {
  if (!optionsJson) return { options: [] };
  try {
    const parsed = JSON.parse(optionsJson) as unknown;
    if (Array.isArray(parsed)) {
      return { options: parsed.map((item) => String(item)) };
    }
    if (parsed && typeof parsed === "object") {
      const objectValue = parsed as { configLabel?: unknown; options?: unknown };
      const options = Array.isArray(objectValue.options)
        ? objectValue.options.map((item) => String(item))
        : [];
      return {
        configLabel:
          typeof objectValue.configLabel === "string"
            ? objectValue.configLabel
            : undefined,
        options,
      };
    }
  } catch {
    return { options: [] };
  }
  return { options: [] };
}

export function getUnitOptions(
  configLabel: string,
  valueType: RuleValueType,
): string[] {
  if (valueType === RuleValueType.Boolean || valueType === RuleValueType.Enum) {
    return [];
  }

  const normalized = configLabel.toLowerCase();
  if (normalized.includes("tenure") || normalized.includes("probation")) {
    return ["days", "months", "years"];
  }
  if (normalized.includes("arrival time")) {
    return ["AM", "PM", "hours"];
  }
  if (normalized.includes("late arrivals")) {
    return ["times"];
  }
  if (normalized.includes("late minutes")) {
    return ["minutes"];
  }
  return ["days", "months", "times"];
}
