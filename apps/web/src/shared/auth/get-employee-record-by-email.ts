import "server-only";

import { getCloudflareD1Config } from "@/shared/auth/get-cloudflare-d1-config";

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

type D1QueryResponse = {
  errors?: Array<{
    message?: string;
  }>;
  result?: Array<{
    results?: Array<{
      department: string;
      email: string;
      employmentStatus: string;
      hireDate: string;
      id: string;
      name: string;
      responsibilityLevel: number | null;
      role: string;
    }>;
  }>;
};

function getGraphqlEndpoint() {
  const endpoint =
    process.env.GRAPHQL_ENDPOINT ?? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

  return endpoint ?? "http://localhost:8787/graphql";
}

async function fetchEmployeeRecordFromGraphql(email: string) {
  const response = await fetch(getGraphqlEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
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
      variables: {
        email,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to load employee access (${response.status}).`);
  }

  const payload = (await response.json()) as EmployeeByEmailResponse;

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "Failed to load employee.");
  }

  return payload.data?.employeeByEmail ?? null;
}

async function fetchEmployeeRecordFromD1(email: string) {
  const config = await getCloudflareD1Config();

  if (!config) {
    throw new Error("Cloudflare D1 access is not configured.");
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        sql: `
          SELECT
            id,
            email,
            name,
            role,
            department,
            employment_status AS employmentStatus,
            hire_date AS hireDate,
            responsibility_level AS responsibilityLevel
          FROM employees
          WHERE lower(email) = lower(?)
          LIMIT 1
        `,
        params: [email],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load employee access (${response.status}).`);
  }

  const payload = (await response.json()) as D1QueryResponse;

  if (payload.errors?.length) {
    throw new Error(
      payload.errors[0]?.message ?? "Failed to load employee from D1.",
    );
  }

  const record = payload.result?.[0]?.results?.[0];

  if (!record) {
    return null;
  }

  return {
    department: record.department,
    email: record.email,
    employmentStatus: record.employmentStatus,
    hireDate: record.hireDate,
    id: record.id,
    name: record.name,
    position: record.role,
    responsibilityLevel: record.responsibilityLevel ?? 1,
  } satisfies EmployeeRecord;
}

export async function getEmployeeRecordByEmail(email: string) {
  try {
    return await fetchEmployeeRecordFromGraphql(email);
  } catch {
    return fetchEmployeeRecordFromD1(email);
  }
}
