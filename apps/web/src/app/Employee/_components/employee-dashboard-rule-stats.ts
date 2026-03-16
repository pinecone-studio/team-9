import { parseJsonValue } from "./employee-dashboard-json";
import {
  collectBooleanSignals,
  collectNumericSignals,
  extractPassedFlagsFromRuleResults,
  isRulePassedKey,
  isRuleTotalKey,
  normalizeMetricKey,
} from "./employee-dashboard-rule-metrics";

export function getRuleStats(ruleEvaluationJson: string) {
  const parsedValue = parseJsonValue(ruleEvaluationJson);

  if (!parsedValue) {
    return { passed: 0, total: 0 };
  }

  const arrayFlags = extractPassedFlagsFromRuleResults(parsedValue);

  if (arrayFlags.length > 0) {
    return {
      passed: arrayFlags.filter(Boolean).length,
      total: arrayFlags.length,
    };
  }

  if (typeof parsedValue !== "object") {
    return { passed: 0, total: 0 };
  }

  const parsed = parsedValue as Record<string, unknown>;
  const nestedRuleArrays = Object.entries(parsed)
    .filter(([key, value]) => {
      const normalizedKey = normalizeMetricKey(key);

      return (
        (normalizedKey.includes("result") || normalizedKey.includes("rule")) &&
        Array.isArray(value)
      );
    })
    .map(([, value]) => value);

  for (const candidate of nestedRuleArrays) {
    const candidateFlags = extractPassedFlagsFromRuleResults(candidate);

    if (candidateFlags.length > 0) {
      return {
        passed: candidateFlags.filter(Boolean).length,
        total: candidateFlags.length,
      };
    }
  }

  const totalCandidates = collectNumericSignals(parsed, isRuleTotalKey);
  const passedCandidates = collectNumericSignals(parsed, isRulePassedKey);
  const totalFromCounts = totalCandidates.find(
    (value) => Number.isFinite(value) && value >= 0,
  );
  const passedFromCounts = passedCandidates.find(
    (value) => Number.isFinite(value) && value >= 0,
  );

  if (
    typeof totalFromCounts === "number" &&
    typeof passedFromCounts === "number" &&
    totalFromCounts >= passedFromCounts
  ) {
    return {
      passed: passedFromCounts,
      total: totalFromCounts,
    };
  }

  const booleanFlags = collectBooleanSignals(parsed, isRulePassedKey);

  if (booleanFlags.length === 0) {
    return { passed: 0, total: 0 };
  }

  return {
    passed: booleanFlags.filter(Boolean).length,
    total: booleanFlags.length,
  };
}

export function buildDots(passed: number, total: number) {
  if (total <= 0) {
    return [] as string[];
  }

  const cappedTotal = Math.min(total, 8);
  const cappedPassed = Math.min(passed, cappedTotal);

  return Array.from({ length: cappedTotal }, (_, index) =>
    index < cappedPassed ? "#00C950" : "#EF4444",
  );
}
