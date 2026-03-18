import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";

type HrLayoutProps = {
  children: ReactNode;
};

export default async function HrLayout({ children }: HrLayoutProps) {
  const access = await getCurrentUserAccess();

  if (!access.isAuthenticated) {
    redirect("/auth/login");
  }

  if (access.employeeLookupFailed) {
    redirect("/auth/login?error=access-lookup-failed");
  }

  if (!access.employee) {
    redirect("/auth/login?error=unauthorized-email");
  }

  if (!access.hasHrAccess) {
    redirect("/Employee");
  }

  return children;
}
