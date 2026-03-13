import HrPageShell from "../../HR/_components/HrPageShell";
import RequestsBoard from "./components/RequestsBoard";

export default function RequestsPage() {
  return (
    <HrPageShell
      activeKey="requests"
      hideHeader
      subtitle="Approve, reject, and monitor employee benefit request queues."
      title="Requests"
    >
      <RequestsBoard />
    </HrPageShell>
  );
}
