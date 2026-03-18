import { and, eq, inArray, or } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { employees } from '../../../db/schema/employees';
import type {
	BenefitEligibility,
	MutationOverrideEmployeeBenefitEligibilityArgs,
} from '../../generated/resolvers-types';
import { listEmployeeEligibilityRecords } from '../queries/list-employee-eligibility-records';

const ELIGIBLE_STATUS = 'eligible';
const LOCKED_STATUS = 'locked';

export async function overrideEmployeeBenefitEligibility(
	DB: D1Database,
	args: MutationOverrideEmployeeBenefitEligibilityArgs,
): Promise<BenefitEligibility[]> {
	const db = getDb({ DB });
	const normalizedEmployeeId = args.input.employeeId.trim();
	const normalizedBenefitId = args.input.benefitId?.trim() || null;
	const normalizedOverrideBy = args.input.overrideBy.trim();
	const normalizedOverrideEmail = normalizedOverrideBy.toLowerCase();

	if (!normalizedEmployeeId) {
		throw new Error('employeeId is required');
	}

	if (!normalizedOverrideBy) {
		throw new Error('overrideBy is required');
	}

	const [actor] = await db
		.select({ id: employees.id })
		.from(employees)
		.where(
			or(
				eq(employees.id, normalizedOverrideBy),
				eq(employees.email, normalizedOverrideEmail),
			),
		)
		.limit(1);

	if (!actor) {
		throw new Error('Override actor employee record not found');
	}

	const targets = await db
		.select({
			benefitId: benefitEligibility.benefitId,
			status: benefitEligibility.status,
		})
		.from(benefitEligibility)
		.where(
			normalizedBenefitId
				? and(
						eq(benefitEligibility.employeeId, normalizedEmployeeId),
						eq(benefitEligibility.benefitId, normalizedBenefitId),
					)
				: and(
						eq(benefitEligibility.employeeId, normalizedEmployeeId),
						eq(benefitEligibility.status, LOCKED_STATUS),
					),
		);
	const lockedTargets = targets.filter((target) => target.status === LOCKED_STATUS);

	if (lockedTargets.length === 0) {
		throw new Error(
			normalizedBenefitId
				? 'This benefit is not currently locked.'
				: 'No locked benefits were found for this employee.',
		);
	}

	const now = new Date().toISOString();
	const defaultReason = normalizedBenefitId
		? 'Eligibility overridden from the employee directory.'
		: 'Eligibility overridden in bulk from the employee directory.';
	const overrideReason = args.input.reason?.trim() || defaultReason;
	const targetBenefitIds = lockedTargets.map((target) => target.benefitId);

	await db
		.update(benefitEligibility)
		.set({
			computedAt: now,
			overrideBy: actor.id,
			overrideExpiresAt: null,
			overrideReason,
			status: ELIGIBLE_STATUS,
		})
		.where(
			and(
				eq(benefitEligibility.employeeId, normalizedEmployeeId),
				inArray(benefitEligibility.benefitId, targetBenefitIds),
			),
		);

	return listEmployeeEligibilityRecords(DB, normalizedEmployeeId);
}
