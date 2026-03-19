import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";

import EligibilityRulesPageContent from "./EligibilityRulesPageContent";

type EligibilityRulesPageProps = {
  searchParams?: Promise<{
    dialog?: string | string[];
    section?: string | string[];
  }>;
};

export default async function EligibilityRulesPage({
  searchParams,
}: EligibilityRulesPageProps) {
  const access = await getCurrentUserAccess();
  const currentUserIdentifier =
    access.email ?? access.userId ?? "current_hr_admin";
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedDialog = Array.isArray(resolvedSearchParams.dialog)
    ? resolvedSearchParams.dialog[0]
    : resolvedSearchParams.dialog;
  const requestedCreateSection = Array.isArray(resolvedSearchParams.section)
    ? resolvedSearchParams.section[0]
    : resolvedSearchParams.section;

  return (
    <EligibilityRulesPageContent
      currentUserIdentifier={currentUserIdentifier}
      requestedCreateSection={requestedCreateSection}
      shouldAutoOpenCreateRule={requestedDialog === "create-rule"}
    />
  );
}
