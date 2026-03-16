import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";
import HrPageShell from "../../HR/_components/HrPageShell";
import RequestsBoard from "./components/RequestsBoard";

export default async function RequestsPage() {
  const access = await getCurrentUserAccess();
  const currentUserIdentifier =
    access.email ?? access.userId ?? "reviewing_hr_admin";
  const currentUserRole = access.role ?? "hr_admin";

  return (
    <HrPageShell
      activeKey="requests"
      hideHeader
      subtitle="Approve, reject, and monitor employee benefit request queues."
      title="Requests"
    >
      <RequestsBoard
        currentUserIdentifier={currentUserIdentifier}
        currentUserRole={currentUserRole}
      />
    </HrPageShell>
  );
}
