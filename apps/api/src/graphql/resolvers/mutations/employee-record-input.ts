import { employees } from '../../../db/schema/employees';
import type {
	CreateEmployeeInput,
	UpdateEmployeeInput,
} from '../../generated/resolvers-types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPLOYMENT_STATUSES = new Set(['active', 'probation', 'leave', 'terminated']);

type EmployeeWriteInput = {
	department: string;
	email: string;
	employmentStatus: string;
	hireDate: string;
	lateArrivalCount: number;
	name: string;
	nameEng: string;
	okrSubmitted: boolean;
	role: string;
	responsibilityLevel: number;
};

type EmployeeDbRow = typeof employees.$inferSelect;

function requireText(label: string, value: string | null | undefined): string {
	const normalized = value?.trim();

	if (!normalized) {
		throw new Error(`${label} is required`);
	}

	return normalized;
}

function normalizeEmail(value: string | null | undefined): string {
	const normalized = requireText('email', value).toLowerCase();

	if (!EMAIL_PATTERN.test(normalized)) {
		throw new Error('email must be a valid email address');
	}

	return normalized;
}

function normalizeEmploymentStatus(value: string | null | undefined): string {
	const normalized = requireText('employmentStatus', value).toLowerCase();

	if (!EMPLOYMENT_STATUSES.has(normalized)) {
		throw new Error('employmentStatus is invalid');
	}

	return normalized;
}

function normalizeDate(value: string | null | undefined): string {
	const normalized = requireText('hireDate', value).replace(/\./g, '-');

	if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
		throw new Error('hireDate must use yyyy-mm-dd or yyyy.mm.dd format');
	}

	const timestamp = Date.parse(`${normalized}T00:00:00.000Z`);

	if (!Number.isFinite(timestamp)) {
		throw new Error('hireDate is invalid');
	}

	return normalized;
}

function normalizeInteger(
	label: string,
	value: number | null | undefined,
	options: { min?: number } = {},
): number {
	const normalizedValue = Number(value);

	if (!Number.isInteger(normalizedValue)) {
		throw new Error(`${label} must be an integer`);
	}

	if (typeof options.min === 'number' && normalizedValue < options.min) {
		throw new Error(`${label} must be at least ${options.min}`);
	}

	return normalizedValue;
}

function buildEmployeeWriteInput(input: {
	department: string;
	email: string;
	employmentStatus: string;
	hireDate: string;
	lateArrivalCount: number;
	name: string;
	okrSubmitted: boolean;
	position: string;
	responsibilityLevel: number;
}): EmployeeWriteInput {
	const name = requireText('name', input.name);

	return {
		department: requireText('department', input.department),
		email: normalizeEmail(input.email),
		employmentStatus: normalizeEmploymentStatus(input.employmentStatus),
		hireDate: normalizeDate(input.hireDate),
		lateArrivalCount: normalizeInteger('lateArrivalCount', input.lateArrivalCount, {
			min: 0,
		}),
		name,
		nameEng: name,
		okrSubmitted: input.okrSubmitted,
		role: requireText('position', input.position),
		responsibilityLevel: normalizeInteger(
			'responsibilityLevel',
			input.responsibilityLevel,
			{ min: 1 },
		),
	};
}

export function normalizeCreateEmployeeInput(
	input: CreateEmployeeInput,
): EmployeeWriteInput {
	return buildEmployeeWriteInput({
		department: input.department,
		email: input.email,
		employmentStatus: input.employmentStatus,
		hireDate: input.hireDate,
		lateArrivalCount: input.lateArrivalCount,
		name: input.name,
		okrSubmitted: input.okrSubmitted,
		position: input.position,
		responsibilityLevel: input.responsibilityLevel,
	});
}

export function normalizeUpdateEmployeeInput(
	current: EmployeeDbRow,
	input: UpdateEmployeeInput,
): EmployeeWriteInput {
	return buildEmployeeWriteInput({
		department: input.department ?? current.department,
		email: input.email ?? current.email,
		employmentStatus: input.employmentStatus ?? current.employmentStatus,
		hireDate: input.hireDate ?? current.hireDate,
		lateArrivalCount: input.lateArrivalCount ?? current.lateArrivalCount,
		name: input.name ?? current.name,
		okrSubmitted: input.okrSubmitted ?? current.okrSubmitted,
		position: input.position ?? current.role,
		responsibilityLevel: input.responsibilityLevel ?? current.responsibilityLevel,
	});
}
