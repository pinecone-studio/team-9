import DashboardContent from "../../HR/_components/DashboardContent";
import HrPageShell from "../../HR/_components/HrPageShell";

export default function DashboardPage() {
  return (
    <HrPageShell
      activeKey="dashboard"
      lockViewport
      subtitle="Manage employee benefits and eligibility"
      title="Good Morning, HR person!"
    >
      <div className="h-full min-h-0 overflow-y-auto overflow-x-hidden">
        <DashboardContent />
      </div>
    </HrPageShell>
  );
}
