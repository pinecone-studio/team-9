import { asc, desc, eq, inArray } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import { benefits } from '../../../db/schema/benefits';
import { contracts } from '../../../db/schema/contracts';
import { rules } from '../../../db/schema/rules';
import { isContractExpired, selectCurrentBenefitContract } from '../../../utils/contract-validity';
import { mapBenefitRecord } from '../../../utils/mappers';
import type { BenefitEligibility } from '../../generated/resolvers-types';

type EvaluationResult = {
	passed?: boolean;
};

type RuleMetadata = {
	errorMessage: string;
};

function getFailedRuleMessages(
	isCoreBenefit: boolean,
	ruleEvaluationJson: string,
	ruleMetadata: RuleMetadata[],
): string[] {
	try {
		const evaluationResults = JSON.parse(ruleEvaluationJson) as EvaluationResult[];
		const failedMessages = evaluationResults.flatMap((result, index) => {
			if (result.passed !== false) {
				return [];
			}

			const rule = ruleMetadata[index];

			if (rule?.errorMessage) {
				return [rule.errorMessage];
			}

			if (isCoreBenefit && index === 0) {
				return ['Employee must not be terminated to stay eligible for this benefit.'];
			}

			return ['This benefit is currently locked by an eligibility rule.'];
		});

		return Array.from(new Set(failedMessages));
	} catch {
		return [];
	}
}

export async function listEmployeeEligibilityRecords(DB: D1Database, employeeId: string): Promise<BenefitEligibility[]> {
	try {
		const db = getDb({ DB });

		const rows = await db
			.select({
				id: benefits.id,
				name: benefits.name,
				description: benefits.description,
				categoryId: benefits.categoryId,
				category: benefitCategories.name,
				approval_role: benefits.approvalRole,
				requires_contract: benefits.requiresContract,
				is_active: benefits.isActive,
				is_core: benefits.isCore,
				activeContractId: benefits.activeContractId,
				subsidy_percent: benefits.subsidyPercent,
				vendor_name: benefits.vendorName,
				status: benefitEligibility.status,
				ruleEvaluationJson: benefitEligibility.ruleEvaluationJson,
				computedAt: benefitEligibility.computedAt,
				overrideBy: benefitEligibility.overrideBy,
				overrideExpiresAt: benefitEligibility.overrideExpiresAt,
				overrideReason: benefitEligibility.overrideReason,
				isCore: benefits.isCore,
			})
			.from(benefitEligibility)
			.innerJoin(benefits, eq(benefits.id, benefitEligibility.benefitId))
			.leftJoin(benefitCategories, eq(benefitCategories.id, benefits.categoryId))
			.where(eq(benefitEligibility.employeeId, employeeId))
			.orderBy(asc(benefits.name));

		if (rows.length === 0) {
			return [];
		}

		const benefitIds = Array.from(new Set(rows.map((row) => row.id)));
		const ruleRows = await db
			.select({
				benefitId: benefitRules.benefitId,
				errorMessage: benefitRules.errorMessage,
				priority: benefitRules.priority,
			})
			.from(benefitRules)
			.innerJoin(rules, eq(rules.id, benefitRules.ruleId))
			.where(inArray(benefitRules.benefitId, benefitIds))
			.orderBy(asc(benefitRules.benefitId), asc(benefitRules.priority));
		const ruleMetadataByBenefit = new Map<string, RuleMetadata[]>();

		ruleRows.forEach((rule) => {
			const currentRules = ruleMetadataByBenefit.get(rule.benefitId) ?? [];

			currentRules.push({ errorMessage: rule.errorMessage });
			ruleMetadataByBenefit.set(rule.benefitId, currentRules);
		});

		const contractedBenefitIds = Array.from(
			new Set(
				rows
					.filter((row) => row.requires_contract)
					.map((row) => String(row.id)),
			),
		);
		const contractRows =
			contractedBenefitIds.length > 0
				? await db
						.select()
						.from(contracts)
						.where(inArray(contracts.benefitId, contractedBenefitIds))
						.orderBy(
							asc(contracts.benefitId),
							desc(contracts.isActive),
							desc(contracts.effectiveDate),
							desc(contracts.version),
						)
				: [];
		const contractsByBenefitId = new Map<string, typeof contracts.$inferSelect[]>();

		contractRows.forEach((contract) => {
			const currentContracts = contractsByBenefitId.get(contract.benefitId) ?? [];
			currentContracts.push(contract);
			contractsByBenefitId.set(contract.benefitId, currentContracts);
		});

		const currentContractByBenefitId = new Map<string, typeof contracts.$inferSelect | null>();

		rows.forEach((row) => {
			const benefitId = String(row.id);

			if (!row.requires_contract || currentContractByBenefitId.has(benefitId)) {
				return;
			}

			currentContractByBenefitId.set(
				benefitId,
				selectCurrentBenefitContract(
					contractsByBenefitId.get(benefitId) ?? [],
					row.activeContractId ?? null,
				),
			);
		});

		return rows.map((row) => {
			const benefitId = String(row.id);
			const currentContract = currentContractByBenefitId.get(benefitId) ?? null;
			const contractExpired =
				row.requires_contract &&
				row.status !== 'pending' &&
				Boolean(currentContract?.expiryDate) &&
				isContractExpired(currentContract?.expiryDate);
			const failedRuleMessages = getFailedRuleMessages(
				row.isCore,
				row.ruleEvaluationJson,
				ruleMetadataByBenefit.get(benefitId) ?? [],
			);
			const lockedByContractMessage =
				contractExpired && currentContract?.expiryDate
					? `The current contract expired on ${currentContract.expiryDate}. This benefit is locked until a new contract is uploaded.`
					: null;

			return {
				benefit: mapBenefitRecord({
					id: benefitId,
					name: row.name,
					description: row.description,
					categoryId: row.categoryId,
					category: row.category,
					approval_role: row.approval_role,
					requires_contract: row.requires_contract,
					is_active: row.is_active,
					is_core: row.is_core,
					subsidy_percent: row.subsidy_percent,
					vendor_name: row.vendor_name,
				}),
				status: contractExpired ? 'locked' : row.status,
				ruleEvaluationJson: row.ruleEvaluationJson,
				computedAt: row.computedAt,
				failedRuleMessages: lockedByContractMessage
					? Array.from(new Set([lockedByContractMessage, ...failedRuleMessages]))
					: failedRuleMessages,
				overrideBy: row.overrideBy,
				overrideExpiresAt: row.overrideExpiresAt,
				overrideReason: row.overrideReason,
			};
		});
	} catch (error) {
		throw new Error(
			`Failed to list employee eligibility records: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
