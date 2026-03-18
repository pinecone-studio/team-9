import HrPageShell from "../../HR/_components/HrPageShell";
import EmployeesPageContent from "@/shared/graphql/employees-page-content";
import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";

export default async function EmployeesPage() {
  const access = await getCurrentUserAccess();
  const currentUserIdentifier = access.employee?.id ?? access.email ?? null;

  return (
    <HrPageShell
      activeKey="employees"
      hideHeader
      subtitle="View and manage employee benefit eligibility"
      title="Employees"
    >
      <div className="mt-[55px] w-full">
        <EmployeesPageContent currentUserIdentifier={currentUserIdentifier} />
      </div>
    </HrPageShell>
  );
}
