import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

type BenefitContractDates = Pick<
  NonNullable<EmployeeBenefitDialogQuery["benefitContract"]>,
  "effectiveDate" | "expiryDate"
>;

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

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
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

export function formatContractDate(value: string | null | undefined) {
  const date = parseContractDate(value);

  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

export function formatContractPeriod(effectiveDate: string, expiryDate: string) {
  return `${formatContractDate(effectiveDate)} - ${formatContractDate(expiryDate)}`;
}

export function buildContractDateItems(contract: BenefitContractDates | null) {
  if (!contract) {
    return [];
  }

  return [
    {
      id: "contract-effective-date",
      label: "Effective Date",
      timestamp: formatContractDate(contract.effectiveDate),
      tone: "success" as const,
    },
    {
      id: "contract-expiry-date",
      label: "Expiry Date",
      timestamp: formatContractDate(contract.expiryDate),
      tone: isContractExpired(contract.expiryDate) ? ("danger" as const) : ("neutral" as const),
    },
  ];
}

export function isContractExpired(
  expiryDate: string | null | undefined,
  referenceDate = new Date(),
) {
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

export function buildExpiredContractMessage(expiryDate: string | null | undefined) {
  const formattedExpiryDate = formatContractDate(expiryDate);

  if (formattedExpiryDate === "-") {
    return "This benefit is locked because the current contract has expired. Please wait for HR to upload a renewed contract.";
  }

  return `This benefit is locked because the current contract expired on ${formattedExpiryDate}. Please wait for HR to upload a renewed contract.`;
}

export function getContractFileName(r2ObjectKey: string) {
  const parts = r2ObjectKey.split("/");
  return parts[parts.length - 1] || "Benefit contract";
}

export function resolveSignedContractUrl(signedUrl: string) {
  if (/^https?:\/\//i.test(signedUrl)) {
    return signedUrl;
  }

  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  if (endpoint) {
    return new URL(signedUrl, new URL(endpoint).origin).toString();
  }

  return new URL(signedUrl, window.location.origin).toString();
}
