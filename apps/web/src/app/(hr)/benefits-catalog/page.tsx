import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";
import HrPageShell from "../../HR/_components/HrPageShell";
import BenefitsCatalogContent from "./components/BenefitsCatalogContent";

export default async function BenefitsCatalogPage() {
  const access = await getCurrentUserAccess();
  const currentUserIdentifier =
    access.email ?? access.userId ?? "current_hr_admin";

  return (
    <HrPageShell
      activeKey="benefits-catalog"
      hideHeader
      subtitle="Review, publish, and maintain employee benefit offerings."
      title="Benefits Catalog"
    >
      <BenefitsCatalogContent currentUserIdentifier={currentUserIdentifier} />
    </HrPageShell>
  );
}
