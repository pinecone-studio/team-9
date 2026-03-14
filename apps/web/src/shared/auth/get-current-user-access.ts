import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import {
  getEmployeeRecordByEmail,
  type EmployeeRecord,
} from "@/shared/auth/get-employee-record-by-email";

export type CurrentUserAccess = {
  email: string | null;
  employee: EmployeeRecord | null;
  hasHrAccess: boolean;
  isAuthenticated: boolean;
  role: string | null;
  userId: string | null;
};

const HR_ROLES = new Set(["finance_manager", "hr_admin"]);

function normalizeRole(role: string | null | undefined) {
  return role?.trim().toLowerCase() ?? null;
}

export function isHrRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  return normalizedRole ? HR_ROLES.has(normalizedRole) : false;
}

export const getCurrentUserAccess = cache(
  async (): Promise<CurrentUserAccess> => {
    const { userId } = await auth();

    if (!userId) {
      return {
        email: null,
        employee: null,
        hasHrAccess: false,
        isAuthenticated: false,
        role: null,
        userId: null,
      };
    }

    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ??
      user?.emailAddresses[0]?.emailAddress?.trim().toLowerCase() ??
      null;
    const employee = email ? await getEmployeeRecordByEmail(email) : null;
    const role = normalizeRole(employee?.position);

    return {
      email,
      employee,
      hasHrAccess: isHrRole(role),
      isAuthenticated: true,
      role,
      userId,
    };
  },
);

export async function getDefaultAppPath() {
  const access = await getCurrentUserAccess();

  if (!access.isAuthenticated) {
    return "/auth/login";
  }

  return access.hasHrAccess ? "/dashboard" : "/Employee";
}
