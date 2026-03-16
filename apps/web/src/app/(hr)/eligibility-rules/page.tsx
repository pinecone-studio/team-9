import { getCurrentUserAccess } from "@/shared/auth/get-current-user-access";

import EligibilityRulesPageContent from "./EligibilityRulesPageContent";

export default async function EligibilityRulesPage() {
  const access = await getCurrentUserAccess();
  const currentUserIdentifier =
    access.email ?? access.userId ?? "current_hr_admin";

  return (
    <EligibilityRulesPageContent
      currentUserIdentifier={currentUserIdentifier}
    />
  );
}
