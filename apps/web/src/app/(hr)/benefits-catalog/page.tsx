import HrPageShell from "../../HR/_components/HrPageShell";
import BenefitsCatalogContent from "./components/BenefitsCatalogContent";

export default function BenefitsCatalogPage() {
  return (
    <HrPageShell
      activeKey="benefits-catalog"
      hideHeader
      subtitle="Review, publish, and maintain employee benefit offerings."
      title="Benefits Catalog"
    >
      <BenefitsCatalogContent />
    </HrPageShell>
  );
}
