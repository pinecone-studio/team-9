import type { Benefit, Employee } from '../graphql/generated/resolvers-types';

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

	const description = record.vendor_name
		? subsidyText
			? `${record.vendor_name} - ${subsidyText}`
			: record.vendor_name
		: (record.description ?? subsidyText ?? 'Benefit details unavailable');

	return {
		id: record.id,
		title: record.name,
		description,
		categoryId: record.categoryId ?? '',
		category: record.category ?? 'General',
	};
}
