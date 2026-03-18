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
const UNAUTHENTICATED_ACCESS: CurrentUserAccess = {
  email: null,
  employee: null,
  hasHrAccess: false,
  isAuthenticated: false,
  role: null,
  userId: null,
};

function normalizeRole(role: string | null | undefined) {
  return role?.trim().toLowerCase() ?? null;
}

export function isHrRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  return normalizedRole ? HR_ROLES.has(normalizedRole) : false;
}

export async function getCurrentUserAccess(): Promise<CurrentUserAccess> {
  let userId: string | null = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch (error) {
    console.error("[auth] Failed to resolve auth session.", {
      error: error instanceof Error ? error.message : String(error),
    });
    return UNAUTHENTICATED_ACCESS;
  }

  if (!userId) {
    return UNAUTHENTICATED_ACCESS;
  }

  let user: Awaited<ReturnType<typeof currentUser>> | null = null;

  try {
    user = await currentUser();
  } catch (error) {
    console.error("[auth] Failed to load current user profile.", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return UNAUTHENTICATED_ACCESS;
  }
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

  if (!access.employee) {
    return "/auth/login?error=unauthorized-email";
  }

  return access.hasHrAccess ? "/dashboard" : "/Employee";
}
