import "server-only";

import { createApolloClient } from "@/shared/apollo/client";
import {
  EmployeeAccessByEmailDocument,
  type EmployeeAccessByEmailQuery,
  type EmployeeAccessByEmailQueryVariables,
} from "@/shared/apollo/generated";

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

export async function getEmployeeRecordByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

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
