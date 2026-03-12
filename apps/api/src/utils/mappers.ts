import type { BenefitModel, BenefitRow, EmployeeModel, EmployeeRow } from '../types/employee';

export function mapEmployeeRecord(record: EmployeeRow): EmployeeModel {
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

export function mapBenefitRecord(record: BenefitRow): BenefitModel {
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
		category: record.category ?? 'General',
	};
}
