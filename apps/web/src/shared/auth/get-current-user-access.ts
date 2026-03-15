import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
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

export async function getCurrentUserAccess(): Promise<CurrentUserAccess> {
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
  let employee: EmployeeRecord | null = null;

  if (email) {
    try {
      employee = await getEmployeeRecordByEmail(email);
    } catch (error) {
      console.error("Failed to resolve employee access.", error);
    }
  }

  const role = normalizeRole(employee?.position);
  const hasHrAccess = isHrRole(role);

  if (!employee) {
    console.warn("[auth] No employee record resolved for authenticated user.", {
      email,
      userId,
    });
  } else if (!hasHrAccess) {
    console.info("[auth] Authenticated user resolved without HR dashboard access.", {
      email,
      role,
      userId,
    });
  }

  return {
    email,
    employee,
    hasHrAccess,
    isAuthenticated: true,
    role,
    userId,
  };
}

export async function getDefaultAppPath() {
  const access = await getCurrentUserAccess();

  if (!access.isAuthenticated) {
    return "/auth/login";
  }

  return access.hasHrAccess ? "/dashboard" : "/Employee";
}
