import { redirect } from "next/navigation";
import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";
import { EmployeeContent } from "./_components/EmployeeContent";
import { getEmployeeDashboardData } from "./_components/get-employee-dashboard-data";

export default async function EmployeePage() {
  const access = await getCurrentUserAccess();

  if (!access.isAuthenticated) {
    redirect("/auth/login");
  }

  if (access.hasHrAccess) {
    redirect("/dashboard");
  }

  const employee = access.employee;
  const employeeName = employee?.name ?? "Employee";
  const currentUserIdentifier =
    employee?.email ?? access.email ?? employeeName.toLowerCase();
  const dashboardData = await getEmployeeDashboardData({
    employee,
    employeeName,
  });

  return (
    <EmployeeContent
      currentUserIdentifier={currentUserIdentifier}
      dashboardData={dashboardData}
      employeeEmail={employee?.email ?? access.email ?? null}
      employeeId={employee?.id ?? ""}
      employeeName={employeeName}
    />
  );
}
