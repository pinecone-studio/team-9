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

async function postGraphql<T>(query: string, variables: Record<string, string>) {
  const response = await fetch(getGraphqlEndpoint(), {
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

async function fetchEmployeeRecordFromGraphql(email: string) {
  const payload = await postGraphql<EmployeeByEmailResponse>(
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
    throw new Error(
      payload.errors[0]?.message ?? "Failed to load employee.",
    );
  }

  return payload.data?.employeeByEmail ?? null;
}

async function fetchEmployeeRecordFromEmployeesQuery(email: string) {
  const payload = await postGraphql<EmployeesResponse>(
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
  try {
    return await fetchEmployeeRecordFromGraphql(email);
  } catch {
    return fetchEmployeeRecordFromEmployeesQuery(email);
  }
}
