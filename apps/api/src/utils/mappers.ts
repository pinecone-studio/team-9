import type { BenefitModel, BenefitRow, EmployeeModel, EmployeeRow } from '../types/employee';

export function mapEmployeeRecord(record: EmployeeRow): EmployeeModel {
	return {
		id: record.id,
		name: record.name,
		email: record.email,
		position: record.role,
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
