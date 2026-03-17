import ContractsContent from "../../HR/_components/contracts/ContractsContent";
import HrPageShell from "../../HR/_components/HrPageShell";

export default function ContractsPage() {
  return (
    <HrPageShell
      activeKey="contracts"
      hideHeader
      subtitle="Manage vendor agreements, track contract versions, and monitor employee acceptance."
      title="Contracts"
    >
      <ContractsContent />
    </HrPageShell>
  );
}
