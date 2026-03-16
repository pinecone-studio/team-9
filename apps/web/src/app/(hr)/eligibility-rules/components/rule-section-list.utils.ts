import { Operator, RuleType, RuleValueType } from "@/shared/apollo/generated";
import type { RuleCardModel, RuleSectionView } from "../types";

export function toTitleCase(value?: string | null) {
  if (!value) return undefined;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getMetricLabel(ruleType: RuleType): string | undefined {
  if (ruleType === RuleType.Attendance) return "Late arrivals";
  if (ruleType === RuleType.TenureDays) return "Minimum Tenure";
  if (ruleType === RuleType.ResponsibilityLevel) return "Minimum Level";
  if (ruleType === RuleType.EmploymentStatus) return "Employment Status";
  if (ruleType === RuleType.OkrSubmitted) return "OKR Submitted";
  if (ruleType === RuleType.Role) return "Role";
  return undefined;
}

export function getMetricLabelFromOptionsJson(
  optionsJson: string | null | undefined,
): string | undefined {
  if (!optionsJson) return undefined;
  try {
    const parsed = JSON.parse(optionsJson) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
    const candidate = (parsed as { configLabel?: unknown }).configLabel;
    return typeof candidate === "string" ? candidate : undefined;
  } catch {
    return undefined;
  }
}

export function getFallbackCategoryId(sectionTitle: string): string {
  if (sectionTitle === "Gate Rules") return "cat_gate_rules";
  if (sectionTitle === "Threshold Rules") return "cat_threshold_rules";
  if (sectionTitle === "Tenure Rules") return "cat_tenure_rules";
  return "cat_level_rules";
}

export function getAllowedOperators(valueType: RuleValueType): Operator[] {
  if (valueType === RuleValueType.Boolean) return [Operator.Eq, Operator.Neq];
  if (valueType === RuleValueType.Enum) return [Operator.Eq, Operator.Neq, Operator.In, Operator.NotIn];
  return [Operator.Gte, Operator.Lte, Operator.Eq, Operator.Neq];
}

export function parseDisplayValue(
  defaultValue: string | null | undefined,
  valueType: RuleValueType,
): string | undefined {
  if (!defaultValue) {
    if (valueType === RuleValueType.Boolean) return "True";
    if (valueType === RuleValueType.Enum) return "Option";
    if (valueType === RuleValueType.Date) return "30";
    if (valueType === RuleValueType.Number) return "0";
    return undefined;
  }
  try {
    const parsed = JSON.parse(defaultValue);
    if (Array.isArray(parsed)) return parsed.join(", ");
    if (typeof parsed === "boolean") return parsed ? "True" : "False";
    return String(parsed);
  } catch {
    return defaultValue;
  }
}

export function parseLinkedBenefits(value: string | null | undefined): Array<{ id: string; name: string }> {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as { id?: unknown; name?: unknown };
      if (typeof record.id !== "string" || typeof record.name !== "string") return null;
      return { id: record.id, name: record.name };
    }).filter((item): item is { id: string; name: string } => item !== null);
  } catch {
    return [];
  }
}

export function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function matchesSearch(card: RuleCardModel, search: string): boolean {
  if (!search) return true;
  const tokens = search.split(" ").filter(Boolean);
  if (tokens.length === 0) return true;
  const benefitNames = card.linkedBenefits.map((benefit) => benefit.name).join(" ");
  const haystack = normalizeSearchText([card.name, card.description, card.categoryName, card.metricLabel ?? "", card.metricValue ?? "", card.metricSuffix ?? "", card.defaultUnit ?? "", benefitNames].join(" "));
  return tokens.every((token) => haystack.includes(token));
}

export function buildSections(
  definitions: Array<{
    allowed_operators_json: string;
    category_id: string;
    category_name: string;
    default_operator: Operator;
    default_unit?: string | null;
    default_value?: string | null;
    description: string;
    id: string;
    is_active: boolean;
    linked_benefits_json: string;
    name: string;
    options_json?: string | null;
    rule_type: RuleType;
    usage_count: number;
    value_type: RuleValueType;
  }>,
  sectionTitles: string[],
  searchTerm: string,
): RuleSectionView[] {
  const grouped = new Map<string, RuleCardModel[]>();
  for (const title of sectionTitles) grouped.set(title, []);

  for (const row of definitions) {
    const card: RuleCardModel = {
      categoryId: row.category_id,
      categoryName: row.category_name,
      defaultUnit: row.default_unit,
      defaultValue: row.default_value,
      description: row.description,
      id: row.id,
      linkedBenefits: parseLinkedBenefits(row.linked_benefits_json),
      metricLabel: getMetricLabelFromOptionsJson(row.options_json) ?? getMetricLabel(row.rule_type),
      metricSuffix: toTitleCase(row.default_unit),
      metricValue: parseDisplayValue(row.default_value, row.value_type),
      metricVariant: row.value_type === RuleValueType.Enum || row.value_type === RuleValueType.Boolean ? "select" : "number",
      name: row.name,
      optionsJson: row.options_json,
      operator: row.default_operator,
      ruleType: row.rule_type,
      usageCount: row.usage_count,
      valueType: row.value_type,
    };

    const sectionTitle = grouped.has(row.category_name) ? row.category_name : "Threshold Rules";
    grouped.get(sectionTitle)?.push(card);
  }

  const normalizedSearch = normalizeSearchText(searchTerm);
  const mapped = sectionTitles.map((title) => {
    const cards = [...(grouped.get(title) ?? [])]
      .filter((card) => matchesSearch(card, normalizedSearch))
      .sort((a, b) => a.name.localeCompare(b.name));
    return { cards, count: `${cards.length} Rules`, title };
  });
  return normalizedSearch ? mapped.filter((section) => section.cards.length > 0) : mapped;
}
