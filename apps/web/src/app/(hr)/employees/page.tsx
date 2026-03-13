import HrPageShell from "../../HR/_components/HrPageShell";
import EmployeesPageContent from "@/shared/graphql/employees-page-content";

export default function EmployeesPage() {
  return (
    <HrPageShell
      activeKey="employees"
      subtitle="View and manage employee benefit eligibility"
      title="Employees"
    >
      <EmployeesPageContent />
    </HrPageShell>
  );
}
