import { redirect } from "next/navigation";
import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";
import { EmployeeContent } from "./_components/EmployeeContent";

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

  return <EmployeeContent employeeName={employeeName} />;
}
