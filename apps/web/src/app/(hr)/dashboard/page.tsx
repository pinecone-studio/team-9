import DashboardContent from "../../HR/_components/DashboardContent";
import HrPageShell from "../../HR/_components/HrPageShell";

export default function DashboardPage() {
  return (
    <HrPageShell
      activeKey="dashboard"
      subtitle="Manage employee benefits and eligibility"
      title="Good Evening, HR person"
    >
      <DashboardContent />
    </HrPageShell>
  );
}
