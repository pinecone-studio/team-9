import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  fetchEmployeeRecordFromEmployeesQuery,
  fetchEmployeeRecordFromGraphql,
  getGraphqlEndpoints,
} from "./employee-record-graphql";

export type EmployeeRecord = {
  department: string;
  email: string;
  employmentStatus: string;
  hireDate: string;
  id: string;
  lateArrivalCount30Days?: number | null;
  name: string;
  okrSubmitted?: boolean | null;
  position: string;
  responsibilityLevel: number;
};

type D1Like = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      first: <T>() => Promise<T | null>;
    };
  };
};

export async function getEmployeeRecordByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const employeeFromD1 = await fetchEmployeeRecordFromD1(normalizedEmail);
  let resolvedNoMatchCount = 0;
  let lookupFailureCount = 0;

  if (employeeFromD1) {
    return employeeFromD1;
  }

  for (const endpoint of getGraphqlEndpoints()) {
    try {
      const employee = await fetchEmployeeRecordFromGraphql(endpoint, normalizedEmail);
      if (employee) {
        return employee;
      }

      resolvedNoMatchCount += 1;
      console.warn("[auth] employeeByEmail returned no match.", {
        email: normalizedEmail,
        endpoint,
      });
    } catch (graphqlError) {
      try {
        const employee = await fetchEmployeeRecordFromEmployeesQuery(endpoint, normalizedEmail);
        if (employee) {
          return employee;
        }

        resolvedNoMatchCount += 1;
        console.warn("[auth] employees query returned no match.", {
          email: normalizedEmail,
          endpoint,
        });
      } catch (employeesError) {
        lookupFailureCount += 1;
        console.error("[auth] Employee lookup failed for endpoint.", {
          email: normalizedEmail,
          endpoint,
          employeesError:
            employeesError instanceof Error
              ? employeesError.message
              : String(employeesError),
          graphqlError:
            graphqlError instanceof Error ? graphqlError.message : String(graphqlError),
        });
      }
    }
  }

  if (lookupFailureCount > 0) {
    throw new Error("Failed to load employee access.");
  }
  if (resolvedNoMatchCount > 0) {
    return null;
  }

  throw new Error("Failed to resolve employee access.");
}

async function fetchEmployeeRecordFromD1(email: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as CloudflareEnv & { DB?: D1Like }).DB;

    if (!db) {
      return null;
    }

    return await db
      .prepare(
        `
          SELECT
            id,
            name,
            email,
            department,
            employment_status AS employmentStatus,
            hire_date AS hireDate,
            late_arrival_count AS lateArrivalCount30Days,
            role AS position,
            okr_submitted AS okrSubmitted,
            responsibility_level AS responsibilityLevel
          FROM employees
          WHERE lower(email) = ?
          LIMIT 1
        `,
      )
      .bind(email)
      .first<EmployeeRecord>();
  } catch {
    return null;
  }
}
