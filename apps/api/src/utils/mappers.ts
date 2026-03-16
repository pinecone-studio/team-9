import { ApprovalRole, type Benefit, type Employee } from '../graphql/generated/resolvers-types';

type EmployeeRow = {
	department: string;
	id: string;
	name: string;
	email: string;
	employmentStatus: string;
	hireDate: string;
	role: string;
	responsibilityLevel: number | null;
};

type BenefitRow = {
	id: string;
	name: string;
	categoryId: string | null;
	category: string | null;
	approval_role?: string | null;
	requires_contract?: boolean | null;
	is_active?: boolean | null;
	is_core?: boolean | null;
	subsidy_percent?: number | null;
	vendor_name?: string | null;
	description?: string | null;
};

export function mapEmployeeRecord(record: EmployeeRow): Employee {
	const normalizedResponsibilityLevel =
		typeof record.responsibilityLevel === 'number' && Number.isFinite(record.responsibilityLevel)
			? record.responsibilityLevel
			: 1;

	return {
		department: record.department,
		id: record.id,
		name: record.name,
		email: record.email,
		employmentStatus: record.employmentStatus,
		hireDate: record.hireDate,
		position: record.role,
		responsibilityLevel: normalizedResponsibilityLevel,
	};
}

export function mapBenefitRecord(record: BenefitRow): Benefit {
	const subsidyText = typeof record.subsidy_percent === 'number' ? `${record.subsidy_percent}% subsidy` : null;
	const explicitDescription = record.description?.trim();
	const vendorName = record.vendor_name?.trim() || null;

	const description = explicitDescription
		? explicitDescription
		: vendorName
			? subsidyText
				? `${vendorName} - ${subsidyText}`
				: vendorName
			: (subsidyText ?? 'Benefit details unavailable');

	return {
		id: record.id,
		title: record.name,
		description,
		categoryId: record.categoryId ?? '',
		category: record.category ?? 'General',
		subsidyPercent: record.subsidy_percent ?? null,
		vendorName,
		requiresContract: record.requires_contract ?? false,
		approvalRole: record.approval_role === 'finance_manager' ? ApprovalRole.FinanceManager : ApprovalRole.HrAdmin,
		isActive: record.is_active ?? true,
		isCore: record.is_core ?? false,
	};
}
