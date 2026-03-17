export function normalizeMetricKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isRuleTotalKey(key: string) {
  const normalized = normalizeMetricKey(key);

  return (
    normalized === "total" ||
    normalized === "totalrules" ||
    normalized === "totalcount" ||
    normalized === "totalrulecount" ||
    normalized === "rulecount" ||
    normalized === "rulescount"
  );
}

export function isRulePassedKey(key: string) {
  const normalized = normalizeMetricKey(key);

  return (
    normalized === "passed" ||
    normalized === "ispassed" ||
    normalized === "passedcount" ||
    normalized === "passedrules" ||
    normalized === "rulespassed" ||
    normalized === "metcount" ||
    normalized === "rulesmet" ||
    normalized === "satisfiedcount"
  );
}

export function extractPassedFlagsFromRuleResults(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as boolean[];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const record = entry as Record<string, unknown>;
    const passedValue = record.passed ?? record.isPassed ?? record.met;

    return typeof passedValue === "boolean" ? [passedValue] : [];
  });
}

export function collectBooleanSignals(
  value: unknown,
  matcher: (key: string) => boolean,
): boolean[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectBooleanSignals(item, matcher));
  }

  const entries = Object.entries(value as Record<string, unknown>);
  const direct = entries.flatMap(([key, entryValue]) =>
    matcher(key) && typeof entryValue === "boolean" ? [entryValue] : [],
  );
  const nested = entries.flatMap(([, entryValue]) =>
    collectBooleanSignals(entryValue, matcher),
  );

  return [...direct, ...nested];
}

export function collectNumericSignals(
  value: unknown,
  matcher: (key: string) => boolean,
): number[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectNumericSignals(item, matcher));
  }

  const entries = Object.entries(value as Record<string, unknown>);
  const direct = entries.flatMap(([key, entryValue]) =>
    matcher(key) && typeof entryValue === "number" ? [entryValue] : [],
  );
  const nested = entries.flatMap(([, entryValue]) =>
    collectNumericSignals(entryValue, matcher),
  );

  return [...direct, ...nested];
}
