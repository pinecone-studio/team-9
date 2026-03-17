import "server-only";

<<<<<<< Updated upstream
import { createApolloClient } from "@/shared/apollo/client";
import {
  EmployeeAccessByEmailDocument,
  type EmployeeAccessByEmailQuery,
  type EmployeeAccessByEmailQueryVariables,
} from "@/shared/apollo/generated";
=======
const DEFAULT_GRAPHQL_ENDPOINT =
  "https://ebms-backend.b94889340.workers.dev/graphql";
const DEFAULT_LOCAL_GRAPHQL_ENDPOINT = "http://127.0.0.1:8787/graphql";
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
export async function getEmployeeRecordByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }
=======
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
>>>>>>> Stashed changes

  const client = createApolloClient();
  const { data } = await client.query<
    EmployeeAccessByEmailQuery,
    EmployeeAccessByEmailQueryVariables
  >({
    query: EmployeeAccessByEmailDocument,
    variables: {
      email: normalizedEmail,
    },
    fetchPolicy: "no-cache",
    context: {
      fetchOptions: {
        cache: "no-store",
      },
    },
  });

  return data?.employeeByEmail ?? null;
}
