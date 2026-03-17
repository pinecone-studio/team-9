/* eslint-disable max-lines */
import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

const DEFAULT_GRAPHQL_ENDPOINT =
  "https://ebms-backend.b94889340.workers.dev/graphql";
const DEFAULT_LOCAL_GRAPHQL_ENDPOINT = "http://127.0.0.1:8787/graphql";

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

type EmployeeByEmailResponse = {
  data?: {
    employeeByEmail: EmployeeRecord | null;
  };
  errors?: Array<{
    message: string;
  }>;
};

type EmployeesResponse = {
  data?: {
    employees: EmployeeRecord[];
  };
  errors?: Array<{
    message: string;
  }>;
};

type D1Like = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      first: <T>() => Promise<T | null>;
    };
  };
};

function getGraphqlEndpoint() {
  const endpoint =
    process.env.GRAPHQL_ENDPOINT ?? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

  if (endpoint) {
    return endpoint;
  }

  if (process.env.NODE_ENV === "development") {
    return DEFAULT_LOCAL_GRAPHQL_ENDPOINT;
  }

  return DEFAULT_GRAPHQL_ENDPOINT;
}

function getGraphqlEndpoints() {
  return [...new Set([getGraphqlEndpoint(), DEFAULT_GRAPHQL_ENDPOINT])];
}

async function postGraphql<T>(
  endpoint: string,
  query: string,
  variables: Record<string, string>,
) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to load employee access (${response.status}).`);
  }

  return (await response.json()) as T;
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
  } catch (error) {
    console.warn("[auth] D1 lookup unavailable, falling back to GraphQL.", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function fetchEmployeeRecordFromGraphql(endpoint: string, email: string) {
  const payload = await postGraphql<EmployeeByEmailResponse>(
    endpoint,
    `
      query EmployeeByEmail($email: String!) {
        employeeByEmail(email: $email) {
          id
          name
          email
          department
          employmentStatus
          hireDate
          position
          responsibilityLevel
        }
      }
    `,
    { email },
  );

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "Failed to load employee.");
  }

  return payload.data?.employeeByEmail ?? null;
}

async function fetchEmployeeRecordFromEmployeesQuery(
  endpoint: string,
  email: string,
) {
  const payload = await postGraphql<EmployeesResponse>(
    endpoint,
    `
      query Employees {
        employees {
          id
          name
          email
          department
          employmentStatus
          hireDate
          position
          responsibilityLevel
        }
      }
    `,
    { email },
  );

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "Failed to load employee.");
  }

  return (
    payload.data?.employees.find(
      (employee) => employee.email.trim().toLowerCase() === email,
    ) ?? null
  );
}

export async function getEmployeeRecordByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const employeeFromD1 = await fetchEmployeeRecordFromD1(normalizedEmail);

  if (employeeFromD1) {
    return employeeFromD1;
  }

  for (const endpoint of getGraphqlEndpoints()) {
    try {
      const employee = await fetchEmployeeRecordFromGraphql(
        endpoint,
        normalizedEmail,
      );

      if (employee) {
        return employee;
      }

      console.warn("[auth] employeeByEmail returned no match.", {
        email: normalizedEmail,
        endpoint,
      });
    } catch (graphqlError) {
      try {
        const employee = await fetchEmployeeRecordFromEmployeesQuery(
          endpoint,
          normalizedEmail,
        );

        if (employee) {
          return employee;
        }

        console.warn("[auth] employees query returned no match.", {
          email: normalizedEmail,
          endpoint,
        });
      } catch (employeesError) {
        console.error("[auth] Employee lookup failed for endpoint.", {
          email: normalizedEmail,
          endpoint,
          employeesError:
            employeesError instanceof Error
              ? employeesError.message
              : String(employeesError),
          graphqlError:
            graphqlError instanceof Error
              ? graphqlError.message
              : String(graphqlError),
        });
        continue;
      }
    }
  }

  throw new Error("Failed to load employee access.");
}
