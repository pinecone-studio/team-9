import HrPageShell from "../../HR/_components/HrPageShell";
import BenefitsCatalogHeader from "./components/BenefitsCatalogHeader";
import WellnessSection from "./components/WellnessSection";

export default function BenefitsCatalogPage() {
  return (
    <HrPageShell
      activeKey="benefits-catalog"
      hideHeader
      subtitle="Review, publish, and maintain employee benefit offerings."
      title="Benefits Catalog"
    >
      <BenefitsCatalogHeader />
      <WellnessSection />
    </HrPageShell>
  );
}
