import type { EmployeeRecord } from "./get-employee-record-by-email";

const DEFAULT_GRAPHQL_ENDPOINT =
  "https://ebms-backend.b94889340.workers.dev/graphql";
const DEFAULT_LOCAL_GRAPHQL_ENDPOINT = "http://127.0.0.1:8787/graphql";

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

export function getGraphqlEndpoints() {
  const endpoint =
    process.env.GRAPHQL_ENDPOINT ?? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

  return [
    ...new Set([
      endpoint ||
        (process.env.NODE_ENV === "development"
          ? DEFAULT_LOCAL_GRAPHQL_ENDPOINT
          : DEFAULT_GRAPHQL_ENDPOINT),
      DEFAULT_GRAPHQL_ENDPOINT,
    ]),
  ];
}

export async function fetchEmployeeRecordFromGraphql(endpoint: string, email: string) {
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
          okrSubmitted
          lateArrivalCount30Days: lateArrivalCount
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

export async function fetchEmployeeRecordFromEmployeesQuery(
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
          okrSubmitted
          lateArrivalCount30Days: lateArrivalCount
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
