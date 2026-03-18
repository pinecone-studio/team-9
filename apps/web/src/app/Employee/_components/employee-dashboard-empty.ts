import type { EmployeeRecord } from "@/shared/auth/get-employee-record-by-email";

import { buildSummaryCards } from "./employee-dashboard-summary";
import type {
  EmployeeDashboardViewData,
  EmployeeEligibilitySignals,
} from "./employee-types";

export function buildEmptyEmployeeDashboardData(
  employee: EmployeeRecord | null,
): EmployeeDashboardViewData {
  const emptySignals: EmployeeEligibilitySignals = {
    employmentStatus: employee?.employmentStatus ?? "Unknown",
    lateArrivals30Days: null,
    okrSubmitted: null,
    responsibilityLevel: employee?.responsibilityLevel ?? null,
  };

  return {
    requests: [],
    sections: [],
    signals: emptySignals,
    summaryCards: buildSummaryCards([], 0),
  };
}
