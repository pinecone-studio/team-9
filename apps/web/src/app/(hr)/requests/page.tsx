import HrPageShell from "../../HR/_components/HrPageShell";
import RequestsBoard from "./components/RequestsBoard";

export default function RequestsPage() {
  return (
    <HrPageShell
      activeKey="requests"
      hideHeader
      subtitle="Review employee benefit requests and configuration changes."
      title="Requests"
    >
      <RequestsBoard />
    </HrPageShell>
  );
}
