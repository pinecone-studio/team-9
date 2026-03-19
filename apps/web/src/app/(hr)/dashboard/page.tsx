import DashboardContent from "../../HR/_components/DashboardContent";
import HrPageShell from "../../HR/_components/HrPageShell";
import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";

function formatDashboardName(name: string | null | undefined, email: string | null | undefined) {
  if (name?.trim()) {
    return name.trim();
  }

  if (email?.trim()) {
    const base = email.split("@")[0] ?? email;
    return base
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return "HR person";
}

export default async function DashboardPage() {
  const access = await getCurrentUserAccess();
  const displayName = formatDashboardName(access.employee?.name, access.email);
  const greeting = `Good Morning, ${displayName}`;

  return (
    <HrPageShell
      activeKey="dashboard"
      hideHeader
      subtitle="Manage employee benefits and eligibility"
      title={greeting}
    >
      <div className="mt-[55px] w-full">
        <DashboardContent
          greeting={greeting}
          subtitle="Manage employee benefits and eligibility"
        />
      </div>
    </HrPageShell>
  );
}
