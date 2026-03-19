import type {
  ApprovalRoleValue,
  BenefitEditRulesQuery,
} from "./edit-benefit-dialog.graphql";
import type { SpecificApproverOption } from "./edit-benefit-dialog.types";

function isApproverRole(role: string): role is ApprovalRoleValue {
  return role === "finance_manager" || role === "hr_admin";
}

export function buildSpecificApproverOptions(
  employees?: BenefitEditRulesQuery["employees"],
): SpecificApproverOption[] {
  return (employees ?? [])
    .flatMap((employee) => {
      if (!employee) {
        return [];
      }

      const normalizedPosition = employee.position.trim().toLowerCase();

      if (!isApproverRole(normalizedPosition)) {
        return [];
      }

      const trimmedEmail = employee.email.trim();
      const trimmedName = employee.name.trim();
      const roleLabel = normalizedPosition === "finance_manager" ? "Finance Manager" : "HR";

      return [
        {
          email: trimmedEmail,
          id: employee.id,
          label: trimmedName
            ? `${trimmedName} (${trimmedEmail}) - ${roleLabel}`
            : `${trimmedEmail} - ${roleLabel}`,
          role: normalizedPosition,
        },
      ];
    })
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function findSpecificApprover(
  options: SpecificApproverOption[],
  specificApproverId: string,
) {
  return options.find((approver) => approver.id === specificApproverId) ?? null;
}
