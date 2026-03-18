import DashboardContent from "../../HR/_components/DashboardContent";
import HrPageShell from "../../HR/_components/HrPageShell";

export default function DashboardPage() {
  return (
    <HrPageShell
      activeKey="dashboard"
      hideHeader
      subtitle="Manage employee benefits and eligibility"
      title="Good Morning, HR person!"
    >
      <div className="mt-[55px] w-full">
        <DashboardContent
          greeting="Good Morning, Someone.B !"
          subtitle="Manage employee benefits and eligibility"
        />
      </div>
    </HrPageShell>
  );
}
