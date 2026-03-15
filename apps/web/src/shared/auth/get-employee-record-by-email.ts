/* eslint-disable max-lines */
import "server-only";

const DEFAULT_GRAPHQL_ENDPOINT =
  "https://ebms-backend.b94889340.workers.dev/graphql";

export type EmployeeRecord = {
  department: string;
  email: string;
  employmentStatus: string;
  hireDate: string;
  id: string;
  name: string;
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

function getGraphqlEndpoint() {
  const endpoint =
    process.env.GRAPHQL_ENDPOINT ?? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

  return endpoint ?? DEFAULT_GRAPHQL_ENDPOINT;
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
