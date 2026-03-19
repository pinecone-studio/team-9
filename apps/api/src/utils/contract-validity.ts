import { contracts } from '../db/schema/contracts';

type ContractRecord = typeof contracts.$inferSelect;

const CONTRACT_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function parseContractDate(value: string | null | undefined) {
	if (!value) {
		return null;
	}

	const dateOnlyMatch = CONTRACT_DATE_PATTERN.exec(value.trim());

	if (dateOnlyMatch) {
		const [, year, month, day] = dateOnlyMatch;
		return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
	}

	const parsedDate = new Date(value);
	return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function toUtcDayNumber(value: string | null | undefined) {
	const date = parseContractDate(value);

	if (!date) {
		return null;
	}

	return Math.floor(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
			DAY_IN_MILLISECONDS,
	);
}

export function isContractExpired(expiryDate: string | null | undefined, referenceDate = new Date()) {
	const expiryDayNumber = toUtcDayNumber(expiryDate);

	if (expiryDayNumber === null) {
		return false;
	}

	const referenceDayNumber = Math.floor(
		Date.UTC(
			referenceDate.getUTCFullYear(),
			referenceDate.getUTCMonth(),
			referenceDate.getUTCDate(),
		) / DAY_IN_MILLISECONDS,
	);

	return referenceDayNumber > expiryDayNumber;
}

export function selectCurrentBenefitContract(
	contractRows: ContractRecord[],
	activeContractId: string | null,
) {
	if (activeContractId) {
		const matchedContract = contractRows.find((contract) => contract.id === activeContractId);

		if (matchedContract) {
			return matchedContract;
		}
	}

	return contractRows.find((contract) => contract.isActive) ?? null;
}
