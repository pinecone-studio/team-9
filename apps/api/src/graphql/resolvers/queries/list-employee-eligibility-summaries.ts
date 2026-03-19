import { getDb } from "../../../db";
import { benefitEligibility } from "../../../db/schema/benefit-eligibility";
import { employees } from "../../../db/schema/employees";

type EmployeeEligibilitySummary = {
  active: number;
  employeeId: string;
  eligible: number;
  locked: number;
};

export async function listEmployeeEligibilitySummaries(
  DB: D1Database,
): Promise<EmployeeEligibilitySummary[]> {
  const db = getDb({ DB });
  const [employeeRows, eligibilityRows] = await Promise.all([
    db.select({ id: employees.id }).from(employees),
    db
      .select({
        employeeId: benefitEligibility.employeeId,
        status: benefitEligibility.status,
      })
      .from(benefitEligibility),
  ]);

  const summaryByEmployeeId = new Map<string, EmployeeEligibilitySummary>(
    employeeRows.map((employee) => [
      employee.id,
      {
        active: 0,
        employeeId: employee.id,
        eligible: 0,
        locked: 0,
      },
    ]),
  );

  for (const row of eligibilityRows) {
    const summary = summaryByEmployeeId.get(row.employeeId);
    if (!summary) {
      continue;
    }

    const status = row.status.trim().toLowerCase();
    if (status === "active") {
      summary.active += 1;
    } else if (status === "eligible") {
      summary.eligible += 1;
    } else if (status === "locked") {
      summary.locked += 1;
    }
  }

  return Array.from(summaryByEmployeeId.values());
}
