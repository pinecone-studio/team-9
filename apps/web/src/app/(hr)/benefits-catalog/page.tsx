import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";
import HrPageShell from "../../HR/_components/HrPageShell";
import BenefitsCatalogContent from "./components/BenefitsCatalogContent";

type BenefitsCatalogPageProps = {
  searchParams?: Promise<{
    benefitId?: string | string[];
  }>;
};

export default async function BenefitsCatalogPage({
  searchParams,
}: BenefitsCatalogPageProps) {
  const access = await getCurrentUserAccess();
  const currentUserIdentifier =
    access.email ?? access.userId ?? "current_hr_admin";
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedBenefitId = Array.isArray(resolvedSearchParams.benefitId)
    ? resolvedSearchParams.benefitId[0]
    : resolvedSearchParams.benefitId;

  return (
    <HrPageShell
      activeKey="benefits-catalog"
      hideHeader
      subtitle="Review, publish, and maintain employee benefit offerings."
      title="Benefits Catalog"
    >
      <BenefitsCatalogContent
        currentUserIdentifier={currentUserIdentifier}
        requestedBenefitId={requestedBenefitId}
      />
    </HrPageShell>
  );
}
