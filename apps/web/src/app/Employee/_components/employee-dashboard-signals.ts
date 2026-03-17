import { parseJson } from "./employee-dashboard-json";
import {
  collectBooleanSignals,
  collectNumericSignals,
} from "./employee-dashboard-rule-metrics";

type RuleEvaluationRecord = {
  ruleEvaluationJson: string;
};

export function findFirstBooleanMetric(
  records: RuleEvaluationRecord[],
  matcher: (key: string) => boolean,
) {
  for (const record of records) {
    const parsed = parseJson(record.ruleEvaluationJson);

    if (!parsed) {
      continue;
    }

    const matches = collectBooleanSignals(parsed, matcher);

    if (matches.length > 0) {
      return matches[0] ?? null;
    }
  }

  return null;
}

export function findFirstNumericMetric(
  records: RuleEvaluationRecord[],
  matcher: (key: string) => boolean,
) {
  for (const record of records) {
    const parsed = parseJson(record.ruleEvaluationJson);

    if (!parsed) {
      continue;
    }

    const matches = collectNumericSignals(parsed, matcher);

    if (matches.length > 0) {
      return matches[0] ?? null;
    }
  }

  return null;
}
