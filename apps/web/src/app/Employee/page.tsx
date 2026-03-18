import { redirect } from "next/navigation";
import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";
import { EmployeeDashboardClient } from "./_components/EmployeeDashboardClient";

export default async function EmployeePage() {
  const access = await getCurrentUserAccess();

  if (!access.isAuthenticated) {
    redirect("/auth/login");
  }

  if (!access.employee) {
    redirect("/auth/login?error=unauthorized-email");
  }

  if (access.hasHrAccess) {
    redirect("/dashboard");
  }

  const employee = access.employee;
  const employeeName = employee?.name ?? "Employee";
  const currentUserIdentifier =
    employee?.email ?? access.email ?? employeeName.toLowerCase();

  return (
    <EmployeeDashboardClient
      currentUserIdentifier={currentUserIdentifier}
      employeeEmail={employee?.email ?? access.email ?? null}
      employeeId={employee?.id ?? ""}
      employeeLateArrivals30Days={
        typeof employee?.lateArrivalCount30Days === "number"
          ? employee.lateArrivalCount30Days
          : null
      }
      employeeName={employeeName}
      employeeOkrSubmitted={
        typeof employee?.okrSubmitted === "boolean" ? employee.okrSubmitted : null
      }
      employeeResponsibilityLevel={employee?.responsibilityLevel ?? null}
      employmentStatus={employee?.employmentStatus ?? "Unknown"}
    />
  );
}
